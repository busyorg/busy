import React from 'react';
import PropTypes from 'prop-types';
import './ShareButton.less';

const FacebookShare = ({ url }) => {
  const shareURL = `https://facebook.com/sharer/sharer.php?u=${url}`;
  return (
    <a className="ShareButton" href={shareURL} target="_blank">
      <div className="ShareButton__contents ShareButton__contents__facebook">
        <div aria-hidden="true" className="ShareButton__icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
          </svg>
        </div>
      </div>
    </a>
  );
};

FacebookShare.propTypes = {
  url: PropTypes.string,
};

FacebookShare.defaultProps = {
  url: '',
};

export default FacebookShare;
