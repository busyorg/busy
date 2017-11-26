import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';
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

  render() {
    const { authenticatedUserName } = this.props;
    const port = window.location.port ? `:${window.location.port}` : '';
    const baseURL = `${window.location.protocol}//${window.location.hostname}${port}`;
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
                  defaultMessage="Onboard new users on Busy.org today using the link below and get 20% of their rewards for 30 days."
                />
              </p>
            </div>
            <div className="Invite__content">
              <Form.Item>
                <Input
                  className="Invite__input"
                  value={`${baseURL}/i/@${authenticatedUserName}`}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
