import React from 'react';

import './Modal.scss';

const Modal = ({ children }) => {
  return (
    <div className="Modal modal">
      {children}
    </div>
  );
};

export default Modal;
