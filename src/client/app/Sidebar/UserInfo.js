import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Action from '../../components/Button/Action';
import { Icon } from 'antd';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import _ from 'lodash';
import urlParse from 'url-parse';
import { getUser, getRewardFund, getRate } from '../../reducers';
import { getVoteValue } from '../../helpers/user';
import { calculateVotingPower } from '../../vendor/blockchainProtocolHelpers';
import SocialLinks from '../../components/SocialLinks';
import USDDisplay from '../../components/Utils/USDDisplay';
import { getAuthenticatedUser, getAuthenticatedUserName } from '../../auth/authReducer';

@injectIntl
@connect((state, ownProps) => ({
	currentUser: state.auth.user.name,
  user: getUser(state, ownProps.match.params.name),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
		rate: PropTypes.number.isRequired,
		currentUser: PropTypes.any
  };

  render() {
    const { intl, user, rewardFund, rate, currentUser } = this.props;
    const location = user && _.get(user.json, 'profile.location');
    const profile = (user && _.get(user.json, 'profile')) || {};
    let website = user && _.get(user.json, 'profile.website');

    if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
      website = `http://${website}`;
    }
    const url = urlParse(website);
    let hostWithoutWWW = url.host;

    if (hostWithoutWWW.indexOf('www.') === 0) {
      hostWithoutWWW = hostWithoutWWW.slice(4);
		}
    const voteWorthTME = getVoteValue(
      user,
      rewardFund.recent_claims > 0 ? rewardFund.recent_claims : 1,
      rewardFund.reward_balance,
      1,
      10000,
    );
    const voteWorthUSD = getVoteValue(
      user,
      rewardFund.recent_claims > 0 ? rewardFund.recent_claims : 1,
      rewardFund.reward_balance,
      rate,
      10000,
    );

    return (
      <div>
        {user.name && (
          <div style={{ wordBreak: 'break-word' }}>
            <div className="user-description" style={{ fontSize: '18px' }}>
              {_.get(user && user.json, 'profile.about')}
            </div>
            <div style={{ marginTop: 14, marginBottom: 16 }}>
              {location && (
                <div>
                  <i className="iconfont icon-coordinates text-icon" />
                  {location}
                </div>
              )}
              {website && (
                <div>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </a>
                </div>
              )}
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
                :{' '}
                <FormattedNumber
                  style="percent" // eslint-disable-line react/style-prop-object
                  value={calculateVotingPower(user)}
                  maximumFractionDigits={0}
                />
              </div>
							{/* {
								isNaN(voteWorthTME) ? '' : (
									<div>
										<i className="iconfont icon-dollar text-icon" />
										<FormattedMessage id="vote_value" defaultMessage="Vote Value" />
										:{' '}
										{isNaN(voteWorthTME) ? (
											<Icon type="loading" className="text-icon-right" />
										) : (
											<div>
												{voteWorthTME}
											</div>
										)}
									</div>
								)
							}
							{
								isNaN(voteWorthUSD) ? '' : (
									<div>
										<i className="iconfont icon-dollar text-icon" />
										<FormattedMessage id="vote_value" defaultMessage="Vote Value" />
										:{' '}
										{isNaN(voteWorthUSD) ? (
											<Icon type="loading" className="text-icon-right" />
										) : (
											<USDDisplay value={voteWorthUSD} />
										)}
									</div>
								)
							} */}
              <SocialLinks profile={profile} />
							{
								user.name == currentUser && 
								<div className="edit-profile">
									<Link className="edit-profile" to="/edit-profile">
										<Action>
											<FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
										</Action>
									</Link>
								</div>
							}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserInfo;
