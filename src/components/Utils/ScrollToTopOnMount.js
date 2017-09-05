import React from 'react';
import { withRouter } from 'react-router';

class ScrollToTopOnMount extends React.Component {
  componentDidMount() {
    if (window && window.location.hash === '') {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTopOnMount);
