import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import { getAuthenticatedUserName } from '../reducers';
import FacebookShare from '../components/Button/FacebookShare';
import TwitterShare from '../components/Button/TwitterShare';
import EmailShare from '../components/Button/EmailShare';
import './Invite.less';

@requiresLogin
@injectIntl
@connect(state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
}))
export default class Invite extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    authenticatedUserName: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      copied: false,
      inviteURL: '',
    };

    this.handleCopyClick = this.handleCopyClick.bind(this);
  }

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

  handleCopyClick() {
    this.setState({ copied: true });
  }

  render() {
    const { intl } = this.props;
    const buttonLabel = this.state.copied ? (
      <FormattedMessage id="invite_copied" defaultMessage="Copied" />
    ) : (
      <FormattedMessage id="invite_copy_link" defaultMessage="Copy link" />
    );
    return (
      <div className="shifted">
        <Helmet>
          <title>{intl.formatMessage({ id: 'invite', defaultMessage: 'Invite' })} - Busy</title>
        </Helmet>
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <div className="Invite">
              <div className="Invite__icon-container" />
              <h1 className="Invite__title">
                <FormattedMessage id="invite_title" defaultMessage="Don't use Busy alone!" />
              </h1>
              <p className="Invite__description">
                <FormattedMessage
                  id="invite_info"
                  defaultMessage="Onboard new users on Busy.org today using the link below and get 10% of their rewards for 30 days."
                />
              </p>
              <div className="Invite__input-container">
                <div className="Invite__input-wrapper">
                  <Input className="Invite__input" value={this.state.inviteURL} readOnly />
                  <CopyToClipboard text={this.state.inviteURL} onCopy={this.handleCopyClick}>
                    <span className="Invite__input__copy">{buttonLabel}</span>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="Invite__social">
                <FacebookShare url={this.state.inviteURL} />
                <TwitterShare
                  url={this.state.inviteURL}
                  text={intl.formatMessage(
                    {
                      id: 'invite_share',
                      defaultMessage: 'Join me today on busy.org and get rewarded to blog {link}',
                    },
                    {
                      link: '',
                    },
                  )}
                />
                <EmailShare
                  url={this.state.inviteURL}
                  text={intl.formatMessage(
                    {
                      id: 'invite_share',
                      defaultMessage: 'Join me today on busy.org and get rewarded to blog {link}',
                    },
                    {
                      link: this.state.inviteURL,
                    },
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
