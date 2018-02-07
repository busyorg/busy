import React from 'react';

export default (args = {}) => Element =>
  class DelayComponent extends React.Component {
    constructor() {
      super();
      this.state = { ready: true };
    }

    componentWillMount() {
      const { delay, onRender } = args;
      const d = parseInt(delay, 10);
      if (d && d > 0) {
        this.setState({ ready: false });
        this.timeout = setTimeout(() => {
          this.setState({ ready: true });
          if (onRender && typeof onRender === 'function') {
            onRender();
          }
        }, delay);
      } else {
        this.setState({ ready: true });
      }
    }

    componentWillUnmount() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    }

    render() {
      if (this.state.ready) {
        return <Element {...Element.props} />;
      }
      return null;
    }
  };
