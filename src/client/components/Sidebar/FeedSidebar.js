import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import InterestingPeopleContainer from '../../containers/InterestingPeopleContainer';
import CryptoTrendingCharts from './CryptoTrendingCharts';

const FeedSidebar = ({ match }) => {
  const currentTag = _.get(match, 'params.tag', '');
  const currentCrypto = getCryptoDetails(currentTag);

  return (
    <div>
      {!_.isEmpty(currentCrypto) && <CryptoTrendingCharts cryptos={[currentTag]} />}
      <InterestingPeopleContainer />
    </div>
  );
};

FeedSidebar.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default FeedSidebar;
