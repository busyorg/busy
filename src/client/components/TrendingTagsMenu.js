import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Popover } from 'antd';
import { getTrendingTopics } from '../reducers';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import './TrendingTagsSlider.less';

@withRouter
@connect(state => ({
  trendingTopics: getTrendingTopics(state),
}))
class TrendingTagsSlider extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    trendingTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      displayTagsMenu: false,
    };

    this.handleTagMenuVisibleChange = this.handleTagMenuVisibleChange.bind(this);
    this.hideTagMenu = this.hideTagMenu.bind(this);
    this.handleTagMenuSelect = this.handleTagMenuSelect.bind(this);
  }

  hideTagMenu() {
    this.setState({
      displayTagsMenu: false,
    });
  }

  handleTagMenuVisibleChange(displayTagsMenu) {
    this.setState({ displayTagsMenu });
  }

  handleTagMenuSelect(key) {
    this.hideTagMenu();
    this.props.history.push(`/trending/${key}`);
  }

  render() {
    const { trendingTopics } = this.props;
    const { displayTagsMenu } = this.state;
    const currentTag = _.get(this.props, 'match.params.category', '');

    return (
      <Popover
        placement="bottom"
        trigger="click"
        visible={displayTagsMenu}
        onVisibleChange={this.handleTagMenuVisibleChange}
        overlayStyle={{ position: 'fixed' }}
        overlayClassName="TrendingTagsMenu"
        content={
          <PopoverMenu onSelect={this.handleTagMenuSelect}>
            {_.map(trendingTopics, tag => (
              <PopoverMenuItem key={tag} fullScreenHidden>
                {tag}
              </PopoverMenuItem>
            ))}
          </PopoverMenu>
        }
      >
        <span>{currentTag}</span>
      </Popover>
    );
  }
}

export default TrendingTagsSlider;
