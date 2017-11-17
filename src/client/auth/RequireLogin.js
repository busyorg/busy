import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthFetching, getIsAuthenticated } from '../reducers';
import Loading from '../components/Icon/Loading';
import Error401 from '../statics/Error401';

const RequiredLogin = ({ children, authenticated, fetching }) => {
  if (fetching) {
    return (
      <div className="main-panel">
        <Loading />
      </div>
    );
  }
  if (!authenticated) {
    return <Error401 />;
  }
  return children;
};

RequiredLogin.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default connect(state => ({
  fetching: getIsAuthFetching(state),
  authenticated: getIsAuthenticated(state),
}))(RequiredLogin);
