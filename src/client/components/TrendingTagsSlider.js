import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTrendingTopics } from '../reducers';
import Topic from './Button/Topic';
import './TrendingTagsSlider.less';

const TrendingTagsSlider = ({ trendingTopics }) => (
  <div className="TrendingTagsSlider">
    {_.map(trendingTopics, tag => <Topic key={tag} name={tag} />)}
  </div>
);

TrendingTagsSlider.propTypes = {
  trendingTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(state => ({
  trendingTopics: getTrendingTopics(state),
}))(TrendingTagsSlider);
