import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { getIsTrendingTopicsLoading, getTrendingTopics } from '../reducers';
import Topic from './Button/Topic';
import './TrendingTagsSlider.less';

const TrendingTagsSlider = ({ trendingTopics }) => (
  <div className="TrendingTagsSlider">
    <Scrollbars
      universal
      autoHide
      renderView={({ style, ...props }) => (
        <div style={{ ...style, marginBottom: '-20px' }} {...props} />
      )}
      style={{ width: '100%', height: 46 }}
    >
      <div className="StoryFull__topics__content">
        {_.map(trendingTopics, tag => <Topic key={tag} name={tag} />)}
        <div style={{ flex: '0 0 20px' }} />
      </div>
    </Scrollbars>
  </div>
);

TrendingTagsSlider.propTypes = {
  trendingTopicsLoading: PropTypes.bool.isRequired,
  trendingTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(state => ({
  trendingTopics: getTrendingTopics(state),
  trendingTopicsLoading: getIsTrendingTopicsLoading(state),
}))(TrendingTagsSlider);
