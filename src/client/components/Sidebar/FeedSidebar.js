import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getIsAuthenticated, getRecommendations } from '../../reducers';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import { updateRecommendations } from '../../user/userActions';
import InterestingPeople from './InterestingPeople';
import CryptoTrendingCharts from './CryptoTrendingCharts';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    recommendations: getRecommendations(state),
  }),
  { updateRecommendations },
)
class FeedSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    recommendations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    updateRecommendations: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleInterestingPeopleRefresh = this.handleInterestingPeopleRefresh.bind(this);
  }

  handleInterestingPeopleRefresh() {
    this.props.updateRecommendations();
  }

  render() {
    const { authenticated, recommendations } = this.props;
    const isAuthenticated = authenticated && recommendations.length > 0;
    const currentTag = _.get(this.props, 'match.params.tag', '');
    const currentCrypto = getCryptoDetails(currentTag);

    return (
      <div>
        {!_.isEmpty(currentCrypto) && <CryptoTrendingCharts cryptos={[currentTag]} />}
        {isAuthenticated && (
          <InterestingPeople
            users={recommendations}
            onRefresh={this.handleInterestingPeopleRefresh}
          />
        )}
      </div>
    );
  }
}

export default FeedSidebar;
