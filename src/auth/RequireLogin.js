import React from 'react';
import Loading from '../widgets/Loading';
import Error401 from '../statics/Error401';

const RequiredLogin = ({ children, ...restProps }) => {
  if (restProps.auth.isFetching) {
    return (
      <div className="main-panel">
        <Loading />
      </div>
    );
  }
  if (!restProps.auth.isAuthenticated) {
    return <Error401 />;
  }
  return React.cloneElement(children, restProps);
};

export default RequiredLogin;
