/* eslint-disable no-undef */
import React from 'react';

const IsScrollingHoC = TheComponent =>
class IsScrolling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolling: false,
    };
  }

  setScrollOn = () => {
    if (!this.state.isScrolling) {
      this.setState({ isScrolling: true });
    }
  };

  componentDidMount() {
    if (window) {
      window.addEventListener('scroll', this.setScrollOn, true);
      this.myInterval = setInterval(this.setScrollOff, 700);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('scroll', this.setScrollOn, true);
      clearInterval(this.myInterval);
    }
  }

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
