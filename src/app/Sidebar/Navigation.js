import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../steemAPI';
import { getAuthenticatedUser } from '../../reducers';

import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';

class SidebarWithTopics extends React.PureComponent {
  state = {
    isFetching: true,
    isLoaded: false,
    categories: [],
    props: {},
    menu: 'categories',
  };

  componentWillMount() {
    api.getState('trending/busy', (err, result) => {
      let categories =
        (result.category_idx && result.category_idx.trending) ||
        (result.tag_idx && result.tag_idx.trending);
      categories = categories.filter(Boolean);
      this.setState({
        isFetching: false,
        isLoaded: true,
        categories,
        props: result.props,
      });
    });
  }

  render() {
    return <Topics topics={this.state.categories} />;
  }
}

const Navigation = ({ authenticatedUser }) => (
  <div>
    <Sidenav username={authenticatedUser.name} />
    <SidebarWithTopics />
  </div>
);

Navigation.propTypes = {
  authenticatedUser: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    authenticatedUser: getAuthenticatedUser(state),
  }),
)(Navigation);
