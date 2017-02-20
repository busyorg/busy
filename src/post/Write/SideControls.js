// Forked from https://github.com/rajaraodv/draftjs-examples
import newDebug from 'debug';
import { connect } from 'react-redux';
import { EditorState, AtomicBlockUtils, ContentState, SelectionState } from 'draft-js';
import React, { Component } from 'react';

import './PostEditor.scss';
import Icon from '../../widgets/Icon';
import { uploadFile } from '../../user/userActions';

const debug = newDebug('busy:PostEditor:SideControls');

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

function addNewEntitiy(editorState, entityKey) {
  let newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  const content = newEditorState.getCurrentContent();
  const selection = content.getSelectionBefore();
  const blockMap = content.blockMap.remove(selection.anchorKey);
  const newContent = ContentState.createFromBlockArray(blockMap.toArray());
  const nextKey = newContent.getBlockAfter(newContent.getSelectionAfter().anchorKey).key;
  const selectionState = SelectionState.createEmpty(nextKey);
  newEditorState = EditorState.push(editorState, newContent, 'insert');

  return EditorState.forceSelection(
    newEditorState,
    selectionState
  );
}

function preloadFile({ file }) {
  return new Promise((resolve) => {
    const reader = new global.FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });
}

class SideControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showControls: false, style: null
    };
  }

  findNode({ editorState }) {
    if (!process.env.IS_BROWSER) return;

    const node = getSelectedBlockNode(window); // eslint-disable-line no-undef

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

    if (node) {
      this.show(node);
    }
  }

  show(node) {
    this.setState({
      style: {
        top: node.offsetTop - 4,
        left: -50,
      },
    });
  }

  hide() {
    // Checks if SideControls is mounted
    if (this.SideControls) {
      this.setState({ style: null, showControls: false });
    }
  }

  componentWillReceiveProps(newProps) {
    // {editorState} state is not updated synchronously
    setTimeout(() => this.findNode(newProps));
  }

  onClickUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.fileInput.click();
  };

  onChangeImage = () => {
    const fileInput = this.fileInput;
    const file = fileInput.files[0];
    const username = this.props.user.name;
    let entityKey;
    const contentState = this.props.editorState.getCurrentContent();
    preloadFile({ file })
      .then((dataUrl) => {
        this.hide();
        const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src: dataUrl });
        entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        this.props.onChange(addNewEntitiy(this.props.editorState, entityKey));
        return this.props.uploadFile({ username, file });
      })
      .then(({ value }) => {
        contentState.replaceEntityData(entityKey, { src: value.url });
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
        ref={(c) => { this.SideControls = c; }}
        className="SideControls"
        style={this.state && this.state.style ? this.state.style : {
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <button className="Controls__button" onClick={this.toggleMenu}>
          <Icon name={showControls ? 'close' : 'add'} sm />
        </button>
        {showControls &&
          <div className="Controls__menu">
            <button className="Controls__button" onMouseDown={this.onClickUpload} type="button">
              <Icon name="add_a_photo" sm />
            </button>
            <input className="Controls__image__hidden" ref={(c) => { this.fileInput = c; }} onChange={this.onChangeImage} name="file" type="file" accept="image/*" />
          </div>}
      </div>
    );
  }
}

SideControls = connect(state => ({
  files: state.user.files,
}), { uploadFile })(SideControls);

export default SideControls;
