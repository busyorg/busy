// Forked from https://github.com/rajaraodv/draftjs-examples
import newDebug from 'debug';
import React, { Component } from 'react';
import exportMarkdown from 'draft-js-export-markdown/lib/stateToMarkdown';
import { DefaultDraftBlockRenderMap, Editor, EditorBlock, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import './Write.scss';
import './PostEditor.scss';
import { uploadFile } from '../../user/userActions';

const debug = newDebug('busy:PostEditor');

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'PostEditor__blockquote';
    default: return null;
  }
}

const INLINE_STYLES = [
  {
    label: 'Bold',
    style: 'BOLD'
  },
  {
    label: 'Italic',
    style: 'ITALIC'
  },
  {
    label: 'Underline',
    style: 'UNDERLINE'
  },
  {
    label: 'Monospace',
    style: 'CODE'
  },
];

const BLOCK_TYPES = [
  {
    label: 'H1',
    style: 'header-one'
  },
  {
    label: 'H2',
    style: 'header-two'
  },
  {
    label: 'H3',
    style: 'header-three'
  },
  {
    label: 'H4',
    style: 'header-four'
  },
  {
    label: 'H5',
    style: 'header-five'
  },
  {
    label: 'H6',
    style: 'header-six'
  },
  {
    label: 'Blockquote',
    style: 'blockquote'
  },
  {
    label: 'UL',
    style: 'unordered-list-item'
  },
  {
    label: 'OL',
    style: 'ordered-list-item'
  },
  {
    label: 'Code Block',
    style: 'code-block'
  },
];

function getSelectedBlockNode(root) {
  const selection = root.getSelection();
  if (selection.rangeCount === 0) {
    return null;
  }
  let node = selection.getRangeAt(0).startContainer;
  do {
    if (node.getAttribute && node.getAttribute('data-block') === 'true') {
      return node;
    }
    node = node.parentNode;
  } while (node !== null);
  return null;
}

function getCurrentBlock(editorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  return block;
}

function addNewBlock(editorState, newType, initialData) {
  const selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);

  if (!currentBlock) {
    return editorState;
  }

  if (currentBlock.getLength() === 0) {
    if (currentBlock.getType() === newType) {
      return editorState;
    }

    const newBlock = currentBlock.merge({
      type: newType,
      data: initialData,
    });

    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState,
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
  }
  return editorState;
}


class SideControls extends Component {
  findNode({ editorState }) {
    if (!process.env.IS_BROWSER) return;

    const node = getSelectedBlockNode(window); // eslint-disable-line no-undef
    if (!node) {
      debug('No node');
      this.hide();
      return;
    }

    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (!selectionState.isCollapsed() ||
        selectionState.anchorKey !== selectionState.focusKey) {
      debug(
        'Selection state changed to be (collapsed, anchorKey)',
        selectionState.isCollapsed()
      );
      this.hide();
      return;
    }

    const block = contentState.getBlockForKey(selectionState.anchorKey);
    if (block.getLength() > 0) {
      debug('Block has content, hidding');
      this.hide();
      return;
    }

    this.show(node);
  }

  show(node) {
    this.setState({
      style: {
        display: 'block',
        position: 'absolute',
        top: node.offsetTop - 3,
        left: -40,
      },
    });
  }

  hide() {
    this.setState({
      style: null,
    });
  }

  componentWillReceiveProps(newProps) {
    setTimeout(() => {
      this.findNode(newProps);
    }, 100);
  }

  onClickUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.refs.fileInput.click();
  };

  onChangeImage = () => {
    const fileInput = this.refs.fileInput;
    const username = this.props.user.name;
    this.props.uploadFile({ username, fileInput })
      .then(({ value }) => {
        this.props.onChange(addNewBlock(
          this.props.editorState,
          'atomic:image', {
            src: value.secure_url || value.url,
          }
        ));
      });
  };

  render() {
    return (
      <div
        className="SideControls"
        style={this.state && this.state.style ? this.state.style : {
          display: 'block',
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <button><i className="icon icon-md material-icons">close</i></button>
        <button onMouseDown={this.onClickUpload} type="button">
          <i className="icon icon-md material-icons">add_a_photo</i>
        </button>
        <input
          ref="fileInput"
          onChange={this.onChangeImage}
          name="file"
          type="file"
          style={{
            display: 'none',
          }}
        />
        <button><i className="icon icon-md material-icons">remove</i></button>
      </div>
    );
  }
}

class ImageBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  onClick = () => {
    this.setState({
      selected: !this.state.selected,
    });
  };

  render() {
    const data = this.props.block.getData();
    const src = data.get('src');

    return (
      <div>
        <img
          role="presentation"
          style={
            this.state && this.state.selected ? {
              outline: 'solid 3px #3756a0',
            } : {
            }
          }
          onClick={this.onClick}
          src={src}
        />

        <figcaption>
          <EditorBlock {...this.props} />
        </figcaption>
      </div>
    );
  }
}

class PostEditor extends Component {
  constructor(props) {
    super(props);
    const editorState = process.env.NODE_ENV === 'production'
      ? EditorState.createEmpty()
      : EditorState.createWithContent(
          convertFromRaw(require('./test-state.json').raw) // eslint-disable-line
        );

    this.state = {
      editorState,
    };
  }

  getContent() {
    return {
      markdown: exportMarkdown(
        this.state.editorState.getCurrentContent()
      ),
      raw: convertToRaw(this.state.editorState.getCurrentContent()),
    };
  }

  focus = () => this.refs.editor.focus(); // eslint-disable-line

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  handleKeyCommand = (command) => this._handleKeyCommand(command);

  toggleBlockType = (type) => this._toggleBlockType(type);

  toggleInlineStyle = (style) => this._toggleInlineStyle(style);

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case 'atomic:image': {
        return {
          component: ImageBlock,
        };
      }

      default: {
        return null;
      }
    }
  };

  render() {
    const {
      editorState,
    } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    const className = 'PostEditor__editor';

    return (
      <div className="PostEditor">
        <SideControls
          editorState={editorState}
          onChange={this.onChange}
          uploadFile={this.props.uploadFile}
          user={this.props.user}
        />

        <div className="NewPost__control-group">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />

          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
        </div>

        <div className={className} onClick={this.focus}>
          <Editor
            blockRendererFn={this.blockRendererFn}
            blockStyleFn={getBlockStyle}

            customStyleMap={styleMap}
            blockRenderMap={new Map({
              'atomic:image': {
                element: 'figure',
              }
            }).merge(DefaultDraftBlockRenderMap)}

            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor" // eslint-disable-line
          />
        </div>
      </div>
    );
  }
}

PostEditor = connect((state) => ({
  files: state.userProfile.files,
}), {
  uploadFile,
})(PostEditor);

export default PostEditor;

class StyleButton extends React.Component {
  onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    let className = 'PostEditor__styleButton';
    if (this.props.active) {
      className += ' PostEditor__activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="PostEditor__controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="PostEditor__controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
