import React from 'react';
import './StoryLoading.less';

const StoryLoading = () => (
  <div className="StoryLoading">
    <div className="StoryLoading__header">
      <p className="StoryLoading__header__avatar ant-card-loading-block" />
      <div style={{ width: '100%' }}>
        <div>
          <p className="ant-card-loading-block" style={{ width: '44%' }} />
        </div>
        <p className="ant-card-loading-block" style={{ width: '15%' }} />
      </div>
    </div>
    <div className="StoryLoading__content">
      <p className="ant-card-loading-block" style={{ width: '94%' }} />
      <p>
        <span className="ant-card-loading-block" style={{ width: '28%' }} />
        <span className="ant-card-loading-block" style={{ width: '62%' }} />
      </p>
      <p>
        <span className="ant-card-loading-block" style={{ width: '22%' }} />
        <span className="ant-card-loading-block" style={{ width: '66%' }} />
      </p>
      <p>
        <span className="ant-card-loading-block" style={{ width: '56%' }} />
        <span className="ant-card-loading-block" style={{ width: '39%' }} />
      </p>
      <p>
        <span className="ant-card-loading-block" style={{ width: '21%' }} />
        <span className="ant-card-loading-block" style={{ width: '15%' }} />
        <span className="ant-card-loading-block" style={{ width: '40%' }} />
      </p>
    </div>
  </div>
);

export default StoryLoading;
