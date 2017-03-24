// Copied from https://github.com/cloudflare/react-modal2
// Needed some minor changes
import React from 'react';
import focusScope from 'a11y-focus-scope';
import focusStore from 'a11y-focus-store';
import ExecutionEnvironment from 'exenv';
import { connect } from 'react-redux';
import _ from 'lodash';

function setFocusOn(applicationElement, element) {
  focusStore.storeFocus();
  if (applicationElement) applicationElement.setAttribute('aria-hidden', 'true');
  focusScope.scopeFocus(element);
}

function resetFocus(applicationElement) {
  focusScope.unscopeFocus();
  if (applicationElement) applicationElement.removeAttribute('aria-hidden');
  focusStore.restoreFocus();
}

@connect(
  state => ({
    lastPostId: state.app.lastPostId,
  })
)
export default class ReactModal2 extends React.Component {
  static getApplicationElement() {
    console.warn('`ReactModal2.getApplicationElement` needs to be set for accessibility reasons');
  }

  static propTypes = {
    onClose: React.PropTypes.func.isRequired,

    closeOnEsc: React.PropTypes.bool,
    closeOnBackdropClick: React.PropTypes.bool,

    backdropClassName: React.PropTypes.string,
    backdropStyles: React.PropTypes.object,

    modalClassName: React.PropTypes.string,
    modalStyles: React.PropTypes.object
  };

  static defaultProps = {
    closeOnEsc: true,
    closeOnBackdropClick: true
  };

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      setFocusOn(ReactModal2.getApplicationElement(), this.modal);
      document.addEventListener('keydown', this.handleDocumentKeydown);
    }
  }

  componentDidUpdate(prevProps) {
    // this is only used for the usage of modal in Post items in feed
    // anytime a user change the post inside modal we need to reset the scroll for modal
    if (prevProps.lastPostId !== this.props.lastPostId) {
      this.resetScroll();
    }
  }

  resetScroll() {
    this.backdrop.scrollTop = 0;
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      resetFocus(ReactModal2.getApplicationElement());
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    }
  }

  handleDocumentKeydown = event => {
    if (this.props.closeOnEsc && event.keyCode === 27) {
      this.props.onClose();
    }
  }

  handleBackdropClick = () => {
    if (this.props.closeOnBackdropClick) {
      this.props.onClose();
    }
  }

  handleModalClick = event => {
    event.stopPropagation();
  }

  render() {
    return (
      <div ref={i => this.backdrop = i}
           className={this.props.backdropClassName}
           style={this.props.backdropStyles}
           onClick={this.handleBackdropClick}>
        <div ref={i => this.modal = i}
             className={this.props.modalClassName}
             style={this.props.modalStyles}
             onClick={this.handleModalClick}
             tabIndex="-1">
          {this.props.children}
        </div>
      </div>
    );
  }
}
