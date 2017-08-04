import React, { PropTypes } from 'react';
import _ from 'lodash';
import { FormattedDate } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

import api from '../../steemAPI';
import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';
import Action from '../../components/Button/Action';
import { jsonParse } from '../../helpers/formatter';

class SidebarWithTopics extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      isLoaded: false,
      categories: [],
      props: {},
      menu: 'categories',
    };
  }

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
    return <Topics title="Trending topics" topics={this.state.categories} />;
  }
}

const LeftSidebar = ({ auth, user }) =>
  (<Switch>
    <Route
      path="/@:name"
      render={() =>
        (<div>
          {user.name &&
            <div>
              {_.get(jsonParse(user.json_metadata), 'profile.about')}
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <i className="iconfont icon-time text-icon" />
                Joined{' '}
                <FormattedDate value={user.created} year="numeric" month="long" day="numeric" />
              </div>
            </div>}
          {user && <Action style={{ margin: '5px 0' }} text="Transfer" />}
          {user && <Action style={{ margin: '5px 0' }} text="Message" />}
        </div>)}
    />
    <Route
      path="/"
      render={() =>
        (<div>
          <Sidenav username={auth.user.name} />
          <SidebarWithTopics />
        </div>)}
    />
  </Switch>);

LeftSidebar.propTypes = {
  auth: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
};

LeftSidebar.defaultProps = {
  user: undefined,
};

export default LeftSidebar;
