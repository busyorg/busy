import React from 'react';
import { Gateway } from 'react-gateway';
import ReactModal2 from 'react-modal2';
import Icon from '../Icon';
import './Modal.scss';


export default class Modal extends React.Component {
  static propTypes = {
    onClose: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    closeOnEsc: true,
    closeOnBackdropClick: true,
  };

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
