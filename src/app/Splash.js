import React from 'react';
import steemconnect from 'steemconnect';

import Modal from '../widgets/Modal';

const Splash = () => {
  const loginURL = steemconnect.getLoginUrl(process.env.STEEMCONNECT_REDIRECT_URL);
  return (
    <Modal>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <img src="/img/logo.svg" height="40" />
          </div>
          <div className="modal-body">
            <h3>Please log in with you Steem account</h3>
            <a href={loginURL} className="btn btn-lg btn-primary">Log In With Steem Connect</a>
            <p>New on Steem?</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Splash;
