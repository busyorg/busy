import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import _ from 'lodash';
import urlParse from 'url-parse';

import { getUser, getIsAuthenticated, getAuthenticatedUser } from '../../reducers';
import { openTransfer } from '../../wallet/walletActions';
import Action from '../../components/Button/Action';
import { calculateVotingPower } from '../../vendor/steemitHelpers';

@injectIntl
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    user: getUser(state, ownProps.match.params.name),
  }),
  { openTransfer },
)
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    openTransfer: () => {},
  };

  handleOpenTransfer = () => {
    this.props.openTransfer(this.props.user.name);
  };

  render() {
    const { intl, authenticated, authenticatedUser, user } = this.props;
    const location = user && _.get(user.json_metadata, 'profile.location');
    let website = user && _.get(user.json_metadata, 'profile.website');

    if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
      website = `http://${website}`;
    }
    const url = urlParse(website);
    let hostWithoutWWW = url.host;

    if (hostWithoutWWW.indexOf('www.') === 0) {
      hostWithoutWWW = hostWithoutWWW.slice(4);
    }

    const isSameUser = authenticated && authenticatedUser.name === user.name;
    return (
      <div>
        {user.name &&
          <div style={{ wordBreak: 'break-word' }}>
            {_.get(user && user.json_metadata, 'profile.about')}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              {location &&
                <div>
                  <i className="iconfont icon-coordinates text-icon" />
                  {location}
                </div>}
              {website &&
                <div>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </a>
                </div>}
              <div>
                <i className="iconfont icon-time text-icon" />
                <FormattedMessage
                  id="joined_date"
                  defaultMessage="Joined {date}"
                  values={{
                    date: intl.formatDate(user.created, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  }}
                />
              </div>
              <div>
                <i className="iconfont icon-flashlight text-icon" />
                <FormattedMessage id="voting_power" defaultMessage="Voting Power" />
                :
                {' '}
                <FormattedNumber
                  style="percent" // eslint-disable-line react/style-prop-object
                  value={calculateVotingPower(user)}
                  maximumFractionDigits={0}
                />
              </div>
            </div>
          </div>}
        {user &&
          !isSameUser &&
          <Action
            primary
            style={{ margin: '5px 0' }}
            text={intl.formatMessage({
              id: 'transfer',
              defaultMessage: 'Transfer',
            })}
            onClick={this.handleOpenTransfer}
          />}
      </div>
    );
  }
}

export default UserInfo;
