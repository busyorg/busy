import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SortSelector from './SortSelector/SortSelector';
import Topic from './Button/Topic';
import './TopicSelector.less';

const TopicSelector = ({ sort, isSingle, topics, onTopicClose, onSortChange }) => (
  <div className="TopicSelector">
    <div className="TopicSelector__topics">
      {topics &&
        topics.map(topic => (
          <Topic key={topic} closable={!isSingle} name={topic} onClose={onTopicClose} />
        ))}
    </div>
    <SortSelector sort={sort} onChange={onSortChange}>
      <SortSelector.Item key="trending">
        <FormattedMessage id="sort_trending" defaultMessage="Trending" />
      </SortSelector.Item>
      <SortSelector.Item key="created">
        <FormattedMessage id="sort_created" defaultMessage="Created" />
      </SortSelector.Item>
      <SortSelector.Item key="active">
        <FormattedMessage id="sort_active" defaultMessage="Active" />
      </SortSelector.Item>
      <SortSelector.Item key="hot">
        <FormattedMessage id="sort_hot" defaultMessage="Hot" />
      </SortSelector.Item>
    </SortSelector>
  </div>
);

TopicSelector.propTypes = {
  sort: PropTypes.string,
  isSingle: PropTypes.bool,
  topics: PropTypes.arrayOf(PropTypes.string),
  onTopicClose: PropTypes.func,
  onSortChange: PropTypes.func,
};

TopicSelector.defaultProps = {
  sort: 'trending',
  isSingle: true,
  topics: [],
  onTopicClose: () => {},
  onSortChange: () => {},
};

export default TopicSelector;
