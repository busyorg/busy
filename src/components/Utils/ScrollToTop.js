import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class ScrollToTop extends React.Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
  };

  componentDidUpdate(prevProps) {
    if (window && this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
