import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Popover } from 'antd';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import Topic from './Button/Topic';
import './TopicSelector.less';

class TopicSelector extends React.Component {
  static propTypes = {
    sort: PropTypes.string,
    isSingle: PropTypes.bool,
    bold: PropTypes.bool,
    topics: PropTypes.arrayOf(PropTypes.string),
    onTopicClose: PropTypes.func,
    onSortChange: PropTypes.func,
  };

  static defaultProps = {
    sort: 'trending',
    isSingle: true,
    bold: true,
    topics: [],
    onTopicClose: () => {},
    onSortChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      popoverVisible: false,
    };
  }

  onSelect = key => {
    this.setState({ popoverVisible: false }, () => {
      this.props.onSortChange(key);
    });
  };

  onVisibleChange = visible => this.setState({ popoverVisible: visible });

  render() {
    const { sort, topics, isSingle, bold, onTopicClose } = this.props;
    const { popoverVisible } = this.state;

    return (
      <div className="TopicSelector">
        <div className="TopicSelector__topics">
          {topics &&
            topics.map(topic => (
              <Topic key={topic} closable={!isSingle} name={topic} onClose={onTopicClose} />
            ))}
        </div>
        <div className="TopicSelector__sort">
          <span className="TopicSelector__sort__title">
            <FormattedMessage id="sort_by" defaultMessage="Sort by" />
          </span>
          <Popover
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={this.onVisibleChange}
            content={
              <PopoverMenu bold={bold} onSelect={this.onSelect}>
                <PopoverMenuItem key="trending">
                  <FormattedMessage id="sort_trending" defaultMessage="Trending" />
                </PopoverMenuItem>
                <PopoverMenuItem key="created">
                  <FormattedMessage id="sort_created" defaultMessage="Created" />
                </PopoverMenuItem>
                <PopoverMenuItem key="active">
                  <FormattedMessage id="sort_active" defaultMessage="Active" />
                </PopoverMenuItem>
                <PopoverMenuItem key="hot">
                  <FormattedMessage id="sort_hot" defaultMessage="Hot" />
                </PopoverMenuItem>
              </PopoverMenu>
            }
          >
            <span className="TopicSelector__sort__current">
              <FormattedMessage
                id={`sort_${sort}`}
                defaultMessage={sort.charAt(0).toUpperCase() + sort.slice(1)}
              />
              <i className="iconfont icon-unfold" />
            </span>
          </Popover>
        </div>
      </div>
    );
  }
}

export default TopicSelector;
