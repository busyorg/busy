import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import { getAuthenticatedUserName } from '../reducers';
import './Invite.less';

@requiresLogin
@connect(state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
}))
export default class Invite extends React.Component {
  static propTypes = {
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    authenticatedUserName: '',
  };

  state = {
    copied: false,
    inviteURL: '',
  };

  componentDidMount() {
    this.createInviteURL();
  }

  createInviteURL() {
    const { authenticatedUserName } = this.props;
    if (typeof window !== 'undefined') {
      const inviteURL = `${window.location.protocol}//${
        window.location.host
      }/i/@${authenticatedUserName}`;
      this.setState({ inviteURL });
    }
  }

  handleCopyClick = () => this.setState({ copied: true });

  render() {
    const buttonLabel = this.state.copied ? 'Copied' : 'Copy link';
    return (
      <div className="shifted">
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <div className="Invite__title">
              <h1>
                <FormattedMessage id="invite" defaultMessage="Invite" />
              </h1>
              <p>
                <FormattedMessage
                  id="invite_info"
                  defaultMessage="Onboard new users on Busy.org today using the link below and get 10% of their rewards for 30 days."
                />
              </p>
            </div>
            <div className="Invite__content">
              <div className="">
                <Form.Item>
                  <Input className="Invite__input" value={this.state.inviteURL} readOnly />
                  <CopyToClipboard text={this.state.inviteURL} onCopy={this.handleCopyClick}>
                    <button className="Action ant-btn-lg Action--primary">{buttonLabel}</button>
                  </CopyToClipboard>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
