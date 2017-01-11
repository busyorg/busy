import React from 'react';
import steemconnect from 'steemconnect';
import Modal from '../widgets/Modal';
import './Splash.scss';

const Splash = () => {
  const loginURL = steemconnect.getLoginURL();
  return (
    <div className="Splash">
      <Modal>
        <div className="container container-small">
          <h1>Hello You, Alpha Tester!</h1>
          <p>You can log in now to Busy using your Steem account and Steem Connect.</p>
          <a href={loginURL} className="btn btn-lg btn-outline-success">
            Log In
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default Splash;
