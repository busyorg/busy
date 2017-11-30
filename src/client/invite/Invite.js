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
@connect(
  state => ({
    authenticatedUserName: getAuthenticatedUserName(state),
  }),
)
export default class Invite extends React.Component {
  static propTypes = {
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    authenticatedUserName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  render() {
    const { authenticatedUserName } = this.props;
    let inviteURL;
    if (typeof window !== 'undefined') {
      inviteURL = `${window.location.protocol}//${window.location.host}/i/@${authenticatedUserName}`;
    }
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
                <FormattedMessage
                  id="invite"
                  defaultMessage="Invite"
                />
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
                  <Input
                    className="Invite__input"
                    value={inviteURL}
                    readOnly
                  />
                  <CopyToClipboard
                    text={inviteURL}
                    onCopy={() => this.setState({ copied: true })}
                  >
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
