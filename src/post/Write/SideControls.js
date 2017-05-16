// Forked from https://github.com/rajaraodv/draftjs-examples
import newDebug from 'debug';
import { connect } from 'react-redux';
import { EditorState, AtomicBlockUtils, ContentState, SelectionState } from 'draft-js';
import React, { Component } from 'react';

import './PostEditor.scss';
import Icon from '../../widgets/Icon';
import { uploadFile } from '../../user/userActions';
import { notify } from '../../app/Notification/notificationActions';

const debug = newDebug('busy:PostEditor:SideControls');

function getImageLoaderHTML() {
  const loaderDiv = global.document.createElement('div');
  loaderDiv.className = 'loader-container flex-center';
  loaderDiv.innerHTML = `<div class="Loading flex-center">
        <span>●</span><span>●</span><span>●</span>
      </div>`;
  return loaderDiv;
}
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
    let imageElement;
    const maxFileSize = 8 * 1024 * 1024 * 1024; // 8 mb in bytes
    if (file.size > maxFileSize) {
      return this.props.notify('Max Image size is 8mb', 'error');
    }
    const contentState = this.props.editorState.getCurrentContent();
    const loaderDiv = getImageLoaderHTML();
    return preloadFile({ file })
      .then((dataUrl) => {
        this.hide();
        const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: dataUrl });
        entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        this.props.onChange(addNewEntitiy(this.props.editorState, entityKey));
        imageElement = global.document.querySelectorAll(`img[src="${dataUrl}"]`);
        if (imageElement.length) {
          imageElement[0].style.opacity = 0.5;

          // need to run after imageElement is drawn
          setTimeout(() => {
            loaderDiv.style.width = `${imageElement[0].width}px`;
            loaderDiv.style.height = `${imageElement[0].height}px`;
            loaderDiv.style.marginTop = `-${imageElement[0].height}px`;
          });
          imageElement[0].parentNode.append(loaderDiv);
        }
        return this.props.uploadFile({ username, file });
      })
      .then(({ value }) => {
        contentState.replaceEntityData(entityKey, { src: value.url });
        if (imageElement.length) {
          imageElement[0].style.opacity = 1;
          loaderDiv.remove();
        }
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
}), { uploadFile, notify })(SideControls);

export default SideControls;
