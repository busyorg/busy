import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedDate } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import urlParse from 'url-parse';

import { getAuthenticatedUser } from '../../reducers';

import api from '../../steemAPI';
import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';
import Action from '../../components/Button/Action';

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

const LeftSidebar = ({ authenticatedUser, user }) => {
  const location = user && _.get(user.json_metadata, 'profile.location');
  let website = user && _.get(user.json_metadata, 'profile.website');

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  return (<Switch>
    <Route
      path="/@:name"
      render={() =>
        (<div>
          {user.name &&
            <div>
              {_.get(user && user.json_metadata, 'profile.about')}
              <div style={{ marginTop: 16, marginBottom: 16, overflowWrap: 'break-word' }}>
                {location && <div>
                  <i className="iconfont icon-coordinates text-icon" />
                  {location}
                </div>}
                {website && <div>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    {`${hostWithoutWWW}${url.pathname}`}
                  </a>
                </div>}
                <div>
                  <i className="iconfont icon-time text-icon" />
                  Joined{' '}
                  <FormattedDate value={user.created} year="numeric" month="long" day="numeric" />
                </div>
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
          <Sidenav username={authenticatedUser.name} />
          <SidebarWithTopics />
        </div>)}
    />
  </Switch>);
};

LeftSidebar.propTypes = {
  authenticatedUser: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
};

LeftSidebar.defaultProps = {
  user: undefined,
};

export default connect(
  state => ({
    authenticatedUser: getAuthenticatedUser(state),
  }),
)(LeftSidebar);
