import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import steem from 'steem';
import { getAuthenticatedUser } from '../../reducers';

import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';

class SidebarWithTopics extends React.PureComponent {
  state = {
    categories: [],
    loading: true,
  };

  componentWillMount() {
    steem.api.getTrendingTags(undefined, 50, (err, result) => {
      this.setState({
        loading: false,
      });

      if (!err) {
        this.setState({
          categories: Object.values(result).map(tag => tag.name).filter(tag => tag !== ''),
        });
      }
    });
  }

  render() {
    return <Topics loading={this.state.loading} topics={this.state.categories} />;
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
