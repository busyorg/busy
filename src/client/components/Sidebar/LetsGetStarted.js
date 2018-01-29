import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  getAuthenticatedUser,
  getFollowingList,
  getIsAuthFetching,
  getIsFetchingFollowingList,
} from '../../reducers';
import HorizontalBarChart from '../HorizontalBarChart';
import LetsGetStartedIcon from './LetsGetStartedIcon';
import './SidebarContentBlock.less';
import './LetsGetStarted.less';

@connect(state => ({
  authenticatedUser: getAuthenticatedUser(state),
  followingList: getFollowingList(state),
  isAuthFetching: getIsAuthFetching(state),
  isFetchingFollowingList: getIsFetchingFollowingList(state),
}))
class LetsGetStarted extends React.Component {
  static propTypes = {
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    isFetchingFollowingList: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
  };

  static getCurrentUserState(authenticatedUser, followingList) {
    const hasPost = authenticatedUser.last_root_post !== '1970-01-01T00:00:00';
    const hasVoted = authenticatedUser.last_vote_time !== '1970-01-01T00:00:00';
    const JsonMetadata = _.attempt(JSON.parse, authenticatedUser.json_metadata);
    const hasProfile = _.has(JsonMetadata, 'profile');
    const hasFollowed = _.size(followingList) >= 5;

    return {
      hasProfile,
      hasPost,
      hasVoted,
      hasFollowed,
    };
  }

  static displayContentsByPostRootDate(lastRootPost) {
    if (lastRootPost === '1970-01-01T00:00:00') return true;
    const lastRootPostDate = new Date(lastRootPost);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - lastRootPostDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    console.log('DIFF DAYS', diffDays);
    return diffDays > 5;
  }

  constructor(props) {
    super(props);

    this.state = {
      ...LetsGetStarted.getCurrentUserState(props.authenticatedUser, props.followingList),
    };
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    const newUserState = LetsGetStarted.getCurrentUserState(
      nextProps.authenticatedUser,
      nextProps.followingList,
    );
    const diffHasProfile = this.state.hasProfile !== newUserState.hasProfile;
    const diffHasPost = this.state.hasPost !== newUserState.hasPost;
    const diffHasVoted = this.state.hasVoted !== newUserState.hasVoted;
    const diffHasFollowed = this.state.hasFollowed !== newUserState.hasFollowed;

    if (diffHasProfile) newState.hasProfile = newUserState.hasProfile;
    if (diffHasPost) newState.hasPost = newUserState.hasPost;
    if (diffHasVoted) newState.hasVoted = newUserState.hasVoted;
    if (diffHasFollowed) newState.hasFollowed = newUserState.hasFollowed;

    if (!_.isEmpty(newState)) {
      this.setState(newState);
    }
  }

  render() {
    const { isAuthFetching, isFetchingFollowingList, authenticatedUser } = this.props;
    const { hasProfile, hasPost, hasVoted, hasFollowed } = this.state;
    const totalOptions = 4;
    const currentSelected = _.reduce(
      [hasProfile, hasPost, hasVoted, hasFollowed],
      (total, current) => {
        let newTotal = total;
        if (current) {
          newTotal = total + 1;
        }
        return newTotal;
      },
      0,
    );
    const hideSidebarContent =
      (currentSelected === totalOptions &&
        LetsGetStarted.displayContentsByPostRootDate(authenticatedUser.last_root_post)) ||
      (isAuthFetching || isFetchingFollowingList);

    if (hideSidebarContent) return null;

    return (
      <div className="LetsGetStarted SidebarContentBlock">
        <h4 className="LetsGetStarted__title SidebarContentBlock__title">
          <span className="LetsGetStarted__title__text">
            <FormattedMessage id="lets_get_started" defaultMessage="Let's get started" />
          </span>
          <HorizontalBarChart current={currentSelected} total={totalOptions} />
          <span className="LetsGetStarted__title__description">
            {`${currentSelected}/${totalOptions} `}
            <FormattedMessage id="completed" defaultMessage="Completed" />
          </span>
        </h4>
        <div className="SidebarContentBlock__content">
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasProfile}
              isLoading={isAuthFetching}
              iconClassName="icon-mine"
            />
            <span
              className={classNames('LetsGetStarted__action__text', {
                LetsGetStarted__action__selected: hasProfile,
              })}
            >
              <FormattedMessage id="create_a_profile" defaultMessage="Create a profile" />
            </span>
          </div>
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasFollowed}
              isLoading={isFetchingFollowingList}
              iconClassName="icon-addpeople"
            />
            <span
              className={classNames('LetsGetStarted__action__text', {
                LetsGetStarted__action__selected: hasFollowed,
              })}
            >
              <FormattedMessage id="follow_steemians" defaultMessage="Follow steemians" />
            </span>
          </div>
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasVoted}
              isLoading={isAuthFetching}
              iconClassName="icon-praise"
            />
            <span
              className={classNames('LetsGetStarted__action__text', {
                LetsGetStarted__action__selected: hasVoted,
              })}
            >
              <FormattedMessage id="upvote_good_posts" defaultMessage="Upvote good posts" />
            </span>
          </div>
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasPost}
              isLoading={isAuthFetching}
              iconClassName="icon-order"
            />
            <span
              className={classNames('LetsGetStarted__action__text', {
                LetsGetStarted__action__selected: hasPost,
              })}
            >
              <FormattedMessage id="create_first_post" defaultMessage="Create your first post" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default LetsGetStarted;
