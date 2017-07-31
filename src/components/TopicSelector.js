import React, { PropTypes } from 'react';
import { Popover } from 'antd';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import Topic from './Button/Topic';
import './TopicSelector.less';

class TopicSelector extends React.Component {
  static propTypes = {
    defaultSort: PropTypes.string,
    isSingle: PropTypes.bool,
    bold: PropTypes.bool,
    topics: PropTypes.arrayOf(PropTypes.string),
    onTopicClose: PropTypes.func,
    onSortChange: PropTypes.func,
  }

  static defaultProps = {
    defaultSort: 'trending',
    isSingle: true,
    bold: true,
    topics: [],
    onTopicClose: () => {},
    onSortChange: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSort: props.defaultSort,
      popoverVisible: false,
    };
  }

  onSelect = (key) => {
    this.setState({ currentSort: key, popoverVisible: false }, () => {
      this.props.onSortChange(key);
    });
  };
  onVisibleChange = visible => this.setState({ popoverVisible: visible });

  render() {
    const { topics, isSingle, bold, onTopicClose } = this.props;
    const { currentSort, popoverVisible } = this.state;

    return (
      <div className="TopicSelector">
        <div className="TopicSelector__topics">
          {topics && topics.map(topic => (
            <Topic
              key={topic}
              closable={!isSingle}
              name={topic}
              onClose={onTopicClose}
            />))}
        </div>
        <div className="TopicSelector__sort">
          Sort by:
          <Popover
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={this.onVisibleChange}
            content={
              <PopoverMenu bold={bold} onSelect={this.onSelect}>
                <PopoverMenuItem key="trending">Trending</PopoverMenuItem>
                <PopoverMenuItem key="created">Created</PopoverMenuItem>
                <PopoverMenuItem key="active">Active</PopoverMenuItem>
                <PopoverMenuItem key="cashout">Cashout</PopoverMenuItem>
                {/*<PopoverMenuItem key="votes">Votes</PopoverMenuItem>*/}
                <PopoverMenuItem key="children">Children</PopoverMenuItem>
                <PopoverMenuItem key="hot">Hot</PopoverMenuItem>
                <PopoverMenuItem key="comments">Comments</PopoverMenuItem>
                <PopoverMenuItem key="promoted">Promoted</PopoverMenuItem>
              </PopoverMenu>
            }
          >
            <span className="TopicSelector__sort__current">
              {currentSort.charAt(0).toUpperCase() + currentSort.slice(1)}
              <i className="iconfont icon-unfold" />
            </span>
          </Popover>
        </div>
      </div>
    );
  }
}

export default TopicSelector;
