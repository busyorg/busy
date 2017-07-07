import React from 'react';
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

export default connect(({ auth }) => ({ auth }))(RequiredLogin);
