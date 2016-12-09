// Forked from https://github.com/rajaraodv/draftjs-examples
import newDebug from 'debug';
import React, { Component } from 'react';
import exportMarkdown from 'draft-js-export-markdown/lib/stateToMarkdown';
import { DefaultDraftBlockRenderMap, getVisibleSelectionRect, Editor, EditorBlock, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import classNames from 'classnames';
import Icon from '../../widgets/Icon';

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
    icon: () => <Icon name="format_bold" />
  },
  {
    label: 'Italic',
    style: 'ITALIC',
    icon: () => <Icon name="format_italic" />
  },
  {
    label: 'Underline',
    style: 'UNDERLINE',
    icon: () => <Icon name="format_underline" />
  },
  {
    label: 'Monospace',
    style: 'CODE',
    icon: () => <Icon name="text_format" />
  },
];

const BLOCK_TYPES = [
  // {
  //   label: 'H1',
  //   style: 'header-one',
  //   icon: () => <Icon name="code" />
  // },
  // {
  //   label: 'H2',
  //   style: 'header-two',
  //   icon: () => <Icon name="code" />
  // },
  {
    label: 'H3',
    style: 'header-three',
    icon: () => <Icon name="format_size" />
  },
  {
    label: 'H4',
    style: 'header-four',
    icon: () => <Icon name="format_size" />
  },
  // {
  //   label: 'H5',
  //   style: 'header-five',
  //   icon: () => <Icon name="code" />
  // },
  // {
  //   label: 'H6',
  //   style: 'header-six',
  //   icon: () => <Icon name="code" />
  // },
  {
    label: 'Blockquote',
    style: 'blockquote',
    icon: () => <Icon name="format_quote" />
  },
  // {
  //   label: 'UL',
  //   style: 'unordered-list-item',
  //   icon: () => <Icon name="format_list_bulleted" />
  // },
  // {
  //   label: 'OL',
  //   style: 'ordered-list-item',
  //   icon: () => <Icon name="format_list_numbered" />
  // },
  // {
  //   label: 'Code Block',
  //   style: 'code-block',
  //   icon: () => <Icon name="code" />
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
  const editorBounds = editor.getBoundingClientRect();
  const rangeBounds = getVisibleSelectionRect(global);
  console.log('rangeBounds', rangeBounds);
  if (!rangeBounds || !toolbar) {
    return null;
  }

  const rangeWidth = rangeBounds.right - rangeBounds.left;
  // const rangeHeight = rangeBounds.bottom - rangeBounds.top;

  const toolbarHeight = toolbar.offsetHeight;
  const offsetLeft = (rangeBounds.left - editorBounds.left) + (rangeWidth / 2);
  const offsetTop = rangeBounds.top - editorBounds.top - (toolbarHeight + 14);
  const offsetBottom = (editorBounds.bottom - rangeBounds.top) + 14;
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
  constructor(props) {
    super(props);
    this.state = {
      showControls: false
    };
  }
  findNode({ editorState }) {
    if (!process.env.IS_BROWSER) return;

    const node = getSelectedBlockNode(window); // eslint-disable-line no-undef
    if (!node) {
      debug('No node');
      if (!this.state.showControls) { this.hide(); }
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
        top: node.offsetTop - 4,
        left: -50,
      },
    });
  }

  hide() {
    this.setState({ style: null, showControls: false });
  }

  componentWillReceiveProps(newProps) {
    setTimeout(() => {
      this.findNode(newProps);
    }, 100);
  }

  onClickUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.fileInput.click();
  };

  onChangeImage = () => {
    const fileInput = this.fileInput;
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

  toggleMenu = (e) => {
    e.preventDefault();
    this.setState({ showControls: !this.state.showControls });
  }

  render() {
    const showControls = this.state.showControls;
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
        <button onClick={this.toggleMenu}><Icon name={showControls ? 'close' : 'add'} /></button>
        {showControls && <div className="Controls__menu">
          <button><Icon name="close" /></button>
          <button onMouseDown={this.onClickUpload} type="button">
            <Icon name="add_a_photo" />
          </button>
          <input ref={(c) => { this.fileInput = c; }} onChange={this.onChangeImage} name="file" type="file" />
          <button><Icon name="remove" /></button>
        </div>}
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
    const editorState = EditorState.createEmpty();

    this.state = {
      editorState, showToolbar: false, lastResetedBlock: null
    };
  }

  getContent() {
    return {
      markdown: exportMarkdown(this.state.editorState.getCurrentContent()),
      raw: convertToRaw(this.state.editorState.getCurrentContent()),
    };
  }

  updateToolBarState = () => {
    const selection = this.state.editorState.getSelection();
    const newState = this.state.editorState;
    const hasSelectedText = !selection.isCollapsed();
    let shouldUpdateState = false;
    if (hasSelectedText) {
      const selectionCoords = getSelectionCoords(this.editor, this.toolbar);
      if (selectionCoords &&
        (!this.state.position ||
          this.state.position.bottom !== selectionCoords.offsetBottom ||
          this.state.position.left !== selectionCoords.offsetLeft)) {
        shouldUpdateState = true;
        newState.showToolbar = true;
        newState.position = {
          bottom: selectionCoords.offsetBottom,
          left: selectionCoords.offsetLeft
        };
      }
    } else if (newState.showToolbar !== false) {
      shouldUpdateState = true;
      newState.showToolbar = false;
      newState.position = null;
    }
    if (shouldUpdateState) this.setState(newState);
  }

  resetBlockState = (editorState) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    const newEditorState = RichUtils.toggleBlockType(editorState, 'unstyled');
    return EditorState.setInlineStyleOverride(newEditorState, currentStyle.clear());
  }

  onChange = (editorState) => {
    const selection = editorState.getSelection();
    const lastBlock = editorState.getCurrentContent().getLastBlock();
    const newState = { editorState };
    if (selection.anchorKey === lastBlock.key &&
      lastBlock.text.length === 0 &&
      this.state.lastResetedBlock !== lastBlock.key) {
      newState.editorState = this.resetBlockState(newState.editorState);
      newState.lastResetedBlock = lastBlock.key;
    }

    this.setState(newState, () => {
      this.updateToolBarState();
    });
  };

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  toggleInlineStyle = (inlineStyle) => {
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
    const { editorState } = this.state;

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

        <div className={className} ref={(c) => { this.editor = c; }}>
          <Editor
            blockRendererFn={this.blockRendererFn}
            blockStyleFn={getBlockStyle}
            placeholder="Create your own story here"
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
              <ul className="toolbar__list" onMouseDown={(x) => { x.preventDefault(); }}>>
                {INLINE_STYLES.map(type =>
                  <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    onToggle={this.toggleInlineStyle}
                    type="inline"
                    item={type}
                  />
                )}
                <StyleButton type="separator" />
                {BLOCK_TYPES.map(type =>
                  <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    onToggle={this.toggleBlockType}
                    type="block"
                    item={type}
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
}), { uploadFile }, undefined, { withRef: true })(PostEditor);

export default PostEditor;

const Separator = () => <li className="PostEditor__styleButton toolbar__item__separator" />;

const StyleButton = ({ item, type, active, onToggle }) => {
  if (type === 'separator') {
    return (<Separator />);
  }

  const StyleIcon = item.icon;
  let className = 'PostEditor__styleButton';
  if (active) {
    className += ' PostEditor__activeButton';
  }

  return (
    <li className={className} title={item.label}>
      <button onClick={() => onToggle(item.style)} type="button" className="toolbar__button">
        <StyleIcon />
      </button>
    </li>
  );
};

