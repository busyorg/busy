import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { getTrendingTopics } from '../reducers';
import Popover from './Popover';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import './TrendingTagsMenu.less';

@injectIntl
@withRouter
@connect(state => ({
  trendingTopics: getTrendingTopics(state),
}))
class TrendingTagsMenu extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    trendingTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
    intl: PropTypes.shape().isRequired,
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
    const { trendingTopics, intl } = this.props;
    const { displayTagsMenu } = this.state;

    return (
      <div className="TrendingTagsMenu__container">
        <FormattedMessage id="topics" defaultMessage="Topics" />
        <Popover
          placement="bottom"
          trigger="click"
          visible={displayTagsMenu}
          onVisibleChange={this.handleTagMenuVisibleChange}
          overlayStyle={{ position: 'fixed' }}
          overlayClassName="TrendingTagsMenu"
          title={intl.formatMessage({ id: 'trending_topics', defaultMessage: 'Trending topics' })}
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
          <span className="TrendingTagsMenu__select--text">
            <FormattedMessage id="all" defaultMessage="All" />
          </span>
          <i className="iconfont icon-unfold" />
        </Popover>
      </div>
    );
  }
}

export default TrendingTagsMenu;
