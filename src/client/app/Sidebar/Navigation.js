import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAuthenticatedUser,
  getIsTrendingTopicsLoading,
  getTrendingTopics,
} from '../../reducers';

import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';

const Navigation = ({ authenticatedUser, trendingTopicsLoading, trendingTopics }) => (
  <div>
    <Sidenav username={authenticatedUser.name} />
    <Topics loading={trendingTopicsLoading} topics={trendingTopics} />
  </div>
);

Navigation.propTypes = {
  authenticatedUser: PropTypes.shape().isRequired,
  trendingTopicsLoading: PropTypes.bool.isRequired,
  trendingTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(state => ({
  authenticatedUser: getAuthenticatedUser(state),
  trendingTopicsLoading: getIsTrendingTopicsLoading(state),
  trendingTopics: getTrendingTopics(state),
}))(Navigation);
