import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthenticated } from '../reducers';
import LoginModal from '../components/LoginModal';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withAuthActions(WrappedComponent) {
  @connect(state => ({
    authenticated: getIsAuthenticated(state),
  }))
  class Wrapper extends React.Component {
    static propTypes = {
      authenticated: PropTypes.bool,
    };

    static defaultProps = {
      authenticated: false,
    };

    constructor(props) {
      super(props);
      this.state = {
        displayLoginModal: false,
      };

      this.handleActionInit = this.handleActionInit.bind(this);
      this.displayLoginModal = this.displayLoginModal.bind(this);
      this.hideLoginModal = this.hideLoginModal.bind(this);
    }

    displayLoginModal() {
      this.setState({
        displayLoginModal: true,
      });
    }

    hideLoginModal() {
      this.setState({
        displayLoginModal: false,
      });
    }

    handleActionInit(callback) {
      if (this.props.authenticated) {
        callback();
      } else {
        this.displayLoginModal();
      }
    }

    render() {
      return [
        <LoginModal
          key="login-modal"
          visible={this.state.displayLoginModal}
          handleLoginModalCancel={this.hideLoginModal}
        />,
        <WrappedComponent
          key="wrapped-component"
          onActionInitiated={this.handleActionInit}
          {...this.props}
        />,
      ];
    }
  }

  Wrapper.displayName = `withAuthActions(${getDisplayName(WrappedComponent)})`;

  return Wrapper;
}
