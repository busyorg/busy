import React from 'react';
import steemconnect from 'steemconnect';

import Modal from '../widgets/Modal';
import Icon from '../widgets/Icon';

import './Splash.sass';

const Splash = () => {
  const loginURL = steemconnect.getLoginURL();
  return (
    <div className="Splash">
      <Modal>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <img src="/img/logo.svg" height="40" />
            </div>
            <div className="modal-body">
              <h2>We're currently in beta.</h2>
              <p>Utque proeliorum periti rectores primo catervas
                Nemo quaeso miretur, si post exsudatos labores
                Erat autem diritatis eius hoc quoque indicium</p>
              <a href={loginURL} className="btn btn-lg btn-primary">
                <Icon name="lock" sm />{ ' ' }
                Log In
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Splash;
