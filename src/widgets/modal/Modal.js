import React from 'react';
import { Gateway } from 'react-gateway';
import ReactModal2 from './ReactModal2';
import Icon from '../Icon';
import './Modal.scss';

/**
 * This component is only created to facilitate the process of using react-modal2 with react gateway
 *
 * You can import this Modal and use onClose props with internal state to control its appearance:
 *
 *export default class MyComponent extends React.Component {
 * state = {
 *   isModalOpen: false
 * };
 *
 * handleOpen = () => {
 *   this.setState({ isModalOpen: true });
 * };
 *
 * handleClose = () => {
 *   this.setState({ isModalOpen: false });
 * };
 *
 * render() {
 *   return (
 *     <div>
 *       <button onClick={this.handleOpen}>Open</button>
 *       {this.state.isModalOpen && (
 *         <MyCustomModal onClose={this.handleClose}>
 *           <h1>Hello from Modal</h1>
 *           <button onClick={this.handleClose}>Close</button>
 *         </MyCustomModal>
 *       )}
 *     </div>
 *   );
 * }
 *}
 *
 * more info: https://www.npmjs.com/package/react-modal2
 */

const freezeTheScroll = () => {
  // eslint-disable-next-line
  const body = window.document.querySelector('body');
  body.style.overflow = 'hidden';
};

const unfreezeTheScroll = () => {
  // eslint-disable-next-line
  const body = window.document.querySelector('body');
  body.style.overflow = 'initial';
};

export default class Modal extends React.Component {
  static propTypes = {
    onClose: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    closeOnEsc: true,
    closeOnBackdropClick: true,
  };

  /* eslint-disable */
  componentDidMount() {
    if (window) {
      freezeTheScroll();
    }
  }

  componentWillUnmount() {
    if (window) {
      unfreezeTheScroll();
    }
  }
  /* eslint-enable */

  render() {
    return (
      <Gateway into="modal">
        <ReactModal2
          onClose={this.props.onClose}
          closeOnEsc={this.props.closeOnEsc}
          closeOnBackdropClick={this.props.closeOnEsc}
          backdropClassName="BusyModalBackdrop"
          modalClassName="BusyModal"
        >
          <a className="BusyModal--close" onClick={this.props.onClose}>
            <Icon name="close" />
          </a>
          {this.props.children}
        </ReactModal2>
      </Gateway>
    );
  }
}
