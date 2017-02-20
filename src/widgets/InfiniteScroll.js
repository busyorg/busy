/* global window */
import React, { Component, PropTypes } from 'react';
import clone from 'lodash/clone';

import { getTopPosition, setTopPosition } from '../helpers/scrollHelpers';

export default class InfiniteScroll extends Component {
  static propTypes = {
    loadingMore: PropTypes.bool,
    children: PropTypes.array,
    loadMore: PropTypes.func,
    loader: PropTypes.element,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.onScroll, true);
  }

  componentDidUpdate() {
    if (!this.props.loadingMore && this.wrapper.offsetHeight !== this.previousElementHeight) {
      const heightDifference = this.wrapper.offsetHeight - this.previousElementHeight;
      const elementsCompensation = -1 * (56 + 30 + 90);
      setTopPosition(
        this.previousScrollPosition +
          heightDifference +
          elementsCompensation
      );
    }

    if (!this.hasScrolled) {
      setTopPosition(this.wrapper.offsetHeight + 200);
    }

    window.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.onScroll, true);
  }

  onScroll = () => {
    this.hasScrolled = true;
    if (this.props.loadingMore) return;
    if (!this.props.children || this.props.children.length === 0) return;

    const topPosition = getTopPosition();
    if (topPosition < 100) {
      this.previousElements = this.props.children && this.props.children.length;
      this.previousScrollPosition = getTopPosition();
      this.previousElementOffset = this.wrapper.offsetTop;
      this.previousElementHeight = this.wrapper.offsetHeight;
      this.props.loadMore();
    }
  };

  renderLoader() {
    const inner = this.props.loader;
    return (
      <div
        style={{
          margin: '30px 0',
          height: 30,
        }}
      >
        {inner}
      </div>
    );
  }

  render() {
    const children = clone(this.props.children);
    return (
      <div
        ref={(wrapper) => {
          this.wrapper = wrapper;
        }}
      >
        {this.renderLoader()}
        {children}
      </div>
    );
  }
}
