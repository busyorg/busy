/* eslint-disable no-undef */
import React from 'react';

const IsScrollingHoC = (TheComponent) =>
class IsScrolling extends TheComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScrolling: false,
    };
  }

  componentDidMount() {
    if (window) {
      window.document.addEventListener('scroll', this.setScrollOn);
      setInterval(this.setScrollOff, 500);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.document.removeEventListener('scroll', this.setScrollOn);
    }
  }

  setScrollOn = () => {
    if (!this.state.isScrolling) {
      this.setState({ isScrolling: true });
    }
  };

  setScrollOff = () => {
    if (this.state.isScrolling) {
      this.setState({ isScrolling: false });
    }
  };

  render() {
    return (
      <TheComponent
        {...this.props}
        isScrolling={this.state.isScrolling}
      />
    );
  }
};

export default IsScrollingHoC;
