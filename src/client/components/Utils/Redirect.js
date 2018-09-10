import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUseBeta } from '../../reducers';

const Redirect = ({ useBeta }) => {
  if (typeof window !== 'undefined' && window.location.host === 'alpha.weyoume.src' && useBeta) {
    const url = window.location.href.split('/');
    url[2] = 'alpha.weyoume.io';
    window.location.replace(url.join('/'));
  }

  return <div />;
};

Redirect.propTypes = {
  useBeta: PropTypes.bool.isRequired,
};

export default connect(state => ({
  useBeta: getUseBeta(state),
}))(Redirect);
