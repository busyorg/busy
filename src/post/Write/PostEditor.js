// Forked from https://github.com/rajaraodv/draftjs-examples
import newDebug from 'debug';
import React, { Component } from 'react';
import exportMarkdown from 'draft-js-export-markdown/lib/stateToMarkdown';
import { DefaultDraftBlockRenderMap, getVisibleSelectionRect, Editor, EditorBlock, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import classNames from 'classnames';

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
    style: 'BOLD',
    icon: () => <i className="icon icon-md material-icons">format_bold</i>
  },
  {
    label: 'Italic',
    style: 'ITALIC',
    icon: () => <i className="icon icon-md material-icons">format_italic</i>
  },
  {
    label: 'Underline',
    style: 'UNDERLINE',
    icon: () => <i className="icon icon-md material-icons">format_underline</i>
  },
  {
    label: 'Monospace',
    style: 'CODE',
    icon: () => <i className="icon icon-md material-icons">text_format</i>
  },
];

const BLOCK_TYPES = [
  // {
  //   label: 'H1',
  //   style: 'header-one',
  //   icon: () => <i className="icon icon-md material-icons">code</i>
  // },
  // {
  //   label: 'H2',
  //   style: 'header-two',
  //   icon: () => <i className="icon icon-md material-icons">code</i>
  // },
  {
    label: 'H3',
    style: 'header-three',
    icon: () => <i className="icon icon-md material-icons">format_size</i>
  },
  {
    label: 'H4',
    style: 'header-four',
    icon: () => <i className="icon icon-md material-icons">format_size</i>
  },
  // {
  //   label: 'H5',
  //   style: 'header-five',
  //   icon: () => <i className="icon icon-md material-icons">code</i>
  // },
  // {
  //   label: 'H6',
  //   style: 'header-six',
  //   icon: () => <i className="icon icon-md material-icons">code</i>
  // },
  {
    label: 'Blockquote',
    style: 'blockquote',
    icon: () => <i className="icon icon-md material-icons">format_quote</i>
  },
  // {
  //   label: 'UL',
  //   style: 'unordered-list-item',
  //   icon: () => <i className="icon icon-md material-icons">format_list_bulleted</i>
  // },
  // {
  //   label: 'OL',
  //   style: 'ordered-list-item',
  //   icon: () => <i className="icon icon-md material-icons">format_list_numbered</i>
  // },
  // {
  //   label: 'Code Block',
  //   style: 'code-block',
  //   icon: () => <i className="icon icon-md material-icons">code</i>
  // },
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

function getSelectionCoords(editor, toolbar) {
  console.log(editor, toolbar);
  const editorBounds = editor.getBoundingClientRect();
  const rangeBounds = getVisibleSelectionRect(global);

  if (!rangeBounds || !toolbar) {
    return null;
  }

  const rangeWidth = rangeBounds.right - rangeBounds.left;

  const toolbarHeight = toolbar.offsetHeight;
  // const rangeHeight = rangeBounds.bottom - rangeBounds.top;
  const offsetLeft = (rangeBounds.left - editorBounds.left)
    + (rangeWidth / 2);
  const offsetTop = rangeBounds.top - editorBounds.top - (toolbarHeight + 14);
  const offsetBottom = editorBounds.bottom - rangeBounds.top + 14;
  return { offsetLeft, offsetTop, offsetBottom };
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
      editorState, showToolbar: false
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

  setToolBarPosition = () => {
    const editor = this.editor;
    const toolbar = this.toolbar;
    const selectionCoords = getSelectionCoords(editor, toolbar);
    console.log('selectionCoords', selectionCoords);
    if (!selectionCoords) {
      return null;
    }
    if (selectionCoords &&
      !this.state.position ||
      this.state.position.bottom !== selectionCoords.offsetBottom ||
      this.state.position.left !== selectionCoords.offsetLeft) {
      console.log('show toolbar');
      this.setState({
        showToolbar: true,
        position: {
          bottom: selectionCoords.offsetBottom,
          left: selectionCoords.offsetLeft
        }
      });
    }
  }

  onChange = (editorState) => {
    const selection = editorState.getSelection();
    const hasSelectedText = !editorState.getSelection().isCollapsed();
    console.log('onChange', editorState, selection, hasSelectedText);
    const newState = { editorState };
    if (hasSelectedText) {
      this.setToolBarPosition();
    } else {
      newState.showToolbar = false;
    }

    this.setState(newState);
  };

  handleKeyCommand = command => this._handleKeyCommand(command);

  toggleBlockType = type => this._toggleBlockType(type);

  toggleInlineStyle = style => this._toggleInlineStyle(style);

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    console.log('_handleKeyCommand', newState);
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
    const toolbarClasses = classNames('NewPost__toolbar', {
      NewPost__toolbar__visible: this.state.showToolbar,
    });
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
      <div className="PostEditor">
        <SideControls
          editorState={editorState}
          onChange={this.onChange}
          uploadFile={this.props.uploadFile}
          user={this.props.user}
        />

        {/* <div className="NewPost__control-group">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />

          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
        </div>*/}

        <div className={className} ref={(c) => { this.editor = c; }}>
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
          />
        </div>
        <div className={toolbarClasses} style={this.state.position} >
          <div style={{ position: 'absolute', bottom: 0 }}>
            <div className="NewPost__toolbar__wrapper" ref={(c) => { this.toolbar = c; }}>
              <ul className="toolbar__list">
                {INLINE_STYLES.map(type =>
                <StyleButton
                  key={type.label}
                  active={currentStyle.has(type.style)}
                  label={type.label}
                  onToggle={this.toggleInlineStyle}
                  style={type.style}
                  type="inline"
                  icon={type.icon}
                />
              )}
                <StyleButton type="separator" />
                {BLOCK_TYPES.map(type =>
                <StyleButton
                  key={type.label}
                  active={type.style === blockType}
                  label={type.label}
                  onToggle={this.toggleBlockType}
                  style={type.style}
                  type="block"
                  icon={type.icon}
                />
              )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostEditor = connect(state => ({
  files: state.userProfile.files,
}), {
  uploadFile,
}, undefined, { withRef: true })(PostEditor);

export default PostEditor;

const Separator = () => <li className="PostEditor__styleButton toolbar__item__separator" />;

class StyleButton extends React.Component {
  onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    const Icon = this.props.icon;
    if (this.props.type === 'separator') {
      return (<Separator />);
    }

    let className = 'PostEditor__styleButton';
    if (this.props.active) {
      className += ' PostEditor__activeButton';
    }

    return (
      <li className={className} title={this.props.label}>
        <button onClick={this.onToggle} type="button" className="toolbar__button">
          <Icon />
        </button>
      </li>
    );
  }
}
