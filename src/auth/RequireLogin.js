import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from '../components/Icon/Loading';
import Error401 from '../statics/Error401';

const RequiredLogin = ({ children, auth }) => {
  if (auth.isFetching) {
    return (
      <div className="main-panel">
        <Loading />
      </div>
    );
  }
  if (!auth.isAuthenticated) {
    return <Error401 />;
  }
  return children;
};

RequiredLogin.propTypes = {
  auth: PropTypes.shape().isRequired,
  children: PropTypes.element.isRequired,
};

export default connect(({ auth }) => ({ auth }))(RequiredLogin);
