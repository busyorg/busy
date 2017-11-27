import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthFetching, getIsAuthenticated } from '../reducers';
import Loading from '../components/Icon/Loading';
import Error401 from '../statics/Error401';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function requiresLogin(WrappedComponent) {
  const Component = ({ authenticated, fetching, ...props }) => {
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
    return <WrappedComponent {...props} />;
  };

  Component.displayName = `RequiresLogin(${getDisplayName(WrappedComponent)})`;

  Component.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    fetching: PropTypes.bool.isRequired,
  };

  const mapStateToProps = state => ({
    fetching: getIsAuthFetching(state),
    authenticated: getIsAuthenticated(state),
  });

  return connect(mapStateToProps)(Component);
}
