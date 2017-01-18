import React from 'react';
import './Donor.scss';

const Donor = ({
  rank,
}) =>
  <span className="Donor">
    <svg className={`Donor__icon Donor__icon--${rank}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.5 20">
      <polygon points="12.5 10 6.25 20 0 10 6.25 0 12.5 10" />
    </svg>
    { ` ${rank} donor` }
  </span>;

export default Donor;
