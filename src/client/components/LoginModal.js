import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';

class LoginModal extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
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
    const { intl, handleLoginModalCancel, visible } = this.props;
    return (
      <Modal
        title={intl.formatMessage({
          id: 'signup_or_login',
          defaultMessage: 'Sign up or Log in',
        })}
        visible={visible}
        onCancel={handleLoginModalCancel}
        footer={[
          <Button key="signup" onClick={this.handleSignup} size="large">
            <FormattedMessage id="signup" defaultMessage="Sign up" />
          </Button>,
          <Button key="login" type="primary" onClick={this.handleLogin} size="large">
            <FormattedMessage id="login" defaultMessage="Log in" />
          </Button>,
        ]}
      >
        <FormattedMessage
          id="need_login_text"
          defaultMessage="You need to login to use this feature"
        />
      </Modal>
    );
  }
}

export default withRouter(injectIntl(LoginModal));
