import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/Icon/Loading';

const LetsGetStartedIcon = ({ renderCheck, isLoading, iconClassName }) => {
  const checkedIcon = (
    <i className="iconfont icon-success_fill LetsGetStarted__action__icon LetsGetStarted__action__icon__checked" />
  );
  const icon = <i className={`iconfont LetsGetStarted__action__icon ${iconClassName}`} />;

  if (isLoading) {
    return <Loading />;
  }

  return renderCheck ? checkedIcon : icon;
};

LetsGetStartedIcon.propTypes = {
  isLoading: PropTypes.bool,
  renderCheck: PropTypes.bool,
  iconClassName: PropTypes.string,
};

LetsGetStartedIcon.defaultProps = {
  isLoading: false,
  renderCheck: false,
  iconClassName: '',
};

export default LetsGetStartedIcon;
