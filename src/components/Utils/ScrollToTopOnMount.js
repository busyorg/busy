import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';

class ScrollToTopOnMount extends React.Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
  };

  componentDidMount() {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTopOnMount);
