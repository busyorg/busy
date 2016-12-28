// Forked from https://github.com/rajaraodv/draftjs-examples
import newDebug from 'debug';
import { Map } from 'immutable';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import _ from 'lodash';

// draft-js
import exportMarkdown from 'draft-js-export-markdown/lib/stateToMarkdown';
import { DefaultDraftBlockRenderMap, getVisibleSelectionRect as draftVSR, EditorState, Entity, Editor, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

import './Write.scss';
import './PostEditor.scss';
import Icon from '../../widgets/Icon';
import SideControls from './SideControls';
import ImageBlock from './ImageBlock';

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

// Monkey patch for getVisibleSelectionRect bug
// https://github.com/facebook/draft-js/issues/570
function getVisibleSelectionRect(window) {
  let selection = draftVSR(window);

  // When selection the first word of the wrapped line, chrome will return two rects
  // And the first rect has 0 width
  if (selection) {
    const selectionRects = window.getSelection().getRangeAt(0).getClientRects();
    if (selectionRects.length === 2 && selectionRects[0].width === 0) {
      selection = selectionRects[1];
    }
  }
  return selection;
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
];

const BLOCK_TYPES = [
  // {
  //   label: 'H1',
  //   style: 'header-one',
  //   icon: () => <Icon name="code" />
  // },
  {
    label: 'H2',
    style: 'header-two',
    icon: () => <Icon name="title" />
  },
  {
    label: 'H3',
    style: 'header-three',
    icon: () => <Icon name="title" sm />

  },
  // {
  //   label: 'H4',
  //   style: 'header-four',
  //   icon: () => <Icon name="format_size" />
  // },
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
  {
    label: 'Code Block',
    style: 'code-block',
    icon: () => <Icon name="code" />
  },
];

function getSelectionCoords(editor, toolbar) {
  const editorBounds = editor.getBoundingClientRect();
  const rangeBounds = getVisibleSelectionRect(global);
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

  setRawContent(content) {
    this.setState({ editorState: EditorState.createWithContent(convertFromRaw(content)) });
  }

  resetState() {
    this.setState({ editorState: EditorState.createEmpty() });
  }

  updateToolBarState = () => {
    const selection = this.state.editorState.getSelection();
    const newState = this.state.editorState;
    const hasSelectedText = !selection.isCollapsed();
    const selectionCoords = getSelectionCoords(this.editor, this.toolbar);

    let shouldUpdateState = false;
    if (hasSelectedText && selectionCoords) {
      if (!this.state.position ||
        this.state.position.bottom !== selectionCoords.offsetBottom ||
        this.state.position.left !== selectionCoords.offsetLeft) {
        shouldUpdateState = true;
        newState.showToolbar = true;
        newState.position = {
          bottom: selectionCoords.offsetBottom,
          left: selectionCoords.offsetLeft
        };
      }
    } else if (newState.showToolbar !== false || selectionCoords === null) {
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

      if (_.isFunction(this.props.onChange)) {
        this.props.onChange();
      }
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
    if (contentBlock.getType() === 'atomic') {
      const entity = Entity.get(contentBlock.getEntityAt(0));
      const type = entity.getType();
      if (type === 'IMAGE') {
        return {
          component: ImageBlock,
          editable: false,
        };
      }
    }
    return null;
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
          user={this.props.user}
        />

        <div className={className} ref={(c) => { this.editor = c; }}>
          <Editor
            blockRendererFn={this.blockRendererFn}
            blockStyleFn={getBlockStyle}
            placeholder="Write your story…"
            customStyleMap={styleMap}
            blockRenderMap={new Map({
              'atomic:IMAGE': {
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
              <ul className="toolbar__list" onMouseDown={(x) => { x.preventDefault(); }}>
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
}), undefined, undefined, { withRef: true })(PostEditor);

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

