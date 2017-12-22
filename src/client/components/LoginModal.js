import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';
import './LoginModal.less';

class LoginModal extends React.Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    handleLoginModalCancel: PropTypes.func,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    handleLoginModalCancel: () => {},
    visible: false,
  };

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleSignup() {
    window.open('https://steemit.com/pick_account');
    this.props.handleLoginModalCancel();
  }

  handleLogin() {
    const { location } = this.props;
    const next = location.pathname.length > 1 ? location.pathname : '';
    window.location.href = SteemConnect.getLoginURL(next);
  }

  render() {
    const { handleLoginModalCancel, visible } = this.props;
    return (
      <Modal
        title=""
        visible={visible}
        onCancel={handleLoginModalCancel}
        footer={
          <div className="LoginModal__footer">
            <FormattedMessage
              id="login_modal_footer_text"
              defaultMessage="Don't have an account? Signup with {link}"
              values={{
                link: <a role="presentation" onClick={this.handleSignup}>Steemit.com</a>,
              }}
            />
          </div>
        }
      >
        <div className="LoginModal__body">
          <i className="iconfont icon-busy LoginModal__icon" />
          <span className="LoginModal__login-title">
            <FormattedMessage id="login_to_busy" defaultMessage="Login to Busy" />
          </span>
          <span className="LoginModal__login-description">
            <FormattedMessage
              id="login_modal_description"
              defaultMessage="Login with your Steem account using SteemConnect to enjoy Busy at 100%"
            />
          </span>
          <span role="presentation" className="LoginModal__login-button" onClick={this.handleLogin}>
            <FormattedMessage
              id="login_with_steemconnect"
              defaultMessage="Login with SteemConnect"
            />
          </span>
        </div>
      </Modal>
    );
  }
}

export default withRouter(LoginModal);
