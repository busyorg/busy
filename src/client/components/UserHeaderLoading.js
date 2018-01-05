import React from 'react';
import './UserHeaderLoading.less';

const UserHeaderLoading = () => (
  <div className="UserHeaderLoading">
    <div className="UserHeaderLoading__container">
      <div
        className="ant-card-loading-block UserHeaderLoading__avatar"
        style={{ width: '100px', height: '100px' }}
      />
      <div className="UserHeaderLoading__user">
        <div
          className="ant-card-loading-block"
          style={{ width: '160px', height: '32px', marginBottom: 0, marginLeft: 0 }}
        />
        <div
          className="ant-card-loading-block"
          style={{ width: '120px', height: '20px', marginLeft: 0 }}
        />
      </div>
    </div>
  </div>
);

export default UserHeaderLoading;
