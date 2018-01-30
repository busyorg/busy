import React from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Affix component
 * @description This component provides similar behavior to Facebook sidebar.
 * Affix component wraps content with two elements. relativeContainer and affixContainer.
 * <relativeContainer>
 *  <affixContainer>
 *    {children}
 *  </affixContainer>
 * </relativeContainer>
 * affixContainer uses absolute and fixed positioning, so its height has to be
 * observed and relativeContainer should be updated with that height.
 * affixContainer should make use of absolute and fixed positioning in order to
 * fix content in place when reaching edges, but also allow scrolling when user
 * want to reach content inside of it.
 */
class Affix extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    stickPosition: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    stickPosition: 0,
  };

  componentDidMount() {
    this.lastScroll =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    this.top = 0;
    this.bindedBottom = false;
    this.bindedTop = true;

    this.ro = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { height } = entry.contentRect;
        this.relativeContainer.style.height = `${height}px`;
        this.handleScroll();
      });
    });

    document.addEventListener('scroll', this.handleScroll);
    this.ro.observe(this.affixContainer);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
    if (this.ro) this.ro.unobserve(this.affixContainer);
  }

  handleScroll = () => {
    if (!this.relativeContainer || !this.affixContainer || !this.relativeContainer.offsetParent) {
      return;
    }

    const { stickPosition } = this.props;

    const windowHeight = document.body.clientHeight;
    const sidebarHeight = this.affixContainer.clientHeight;
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const scrollBottom = scrollTop + windowHeight;
    const scrollDiff = scrollTop - this.lastScroll;
    const scrollingDown = scrollDiff > 0;
    const parent = this.relativeContainer.offsetParent;
    const parentSpace = parent.offsetTop - stickPosition;

    const viewportOffset = this.affixContainer.getBoundingClientRect();

    const fits = windowHeight >= sidebarHeight + stickPosition;
    const overlaps = viewportOffset.top < parent.getBoundingClientRect().top;
    const shouldBindTop =
      viewportOffset.top >= stickPosition &&
      !scrollingDown &&
      !overlaps &&
      scrollTop >= parent.offsetTop - stickPosition;

    if (fits) {
      if (viewportOffset.top <= stickPosition) {
        this.affixContainer.style.position = 'fixed';
        this.affixContainer.style.top = `${stickPosition}px`;
      }

      if (overlaps && !scrollingDown) {
        this.affixContainer.style.position = 'absolute';
        this.affixContainer.style.top = 'auto';
      }
    } else {
      if (!this.bindedBottom && scrollingDown && viewportOffset.bottom <= windowHeight) {
        this.affixContainer.style.position = 'fixed';
        this.affixContainer.style.top = `${windowHeight - sidebarHeight}px`;
        this.bindedBottom = true;
      }
      if (shouldBindTop) {
        this.affixContainer.style.position = 'fixed';
        this.affixContainer.style.top = `${stickPosition}px`;
        this.bindedTop = true;
      }
      if (this.bindedBottom && !scrollingDown) {
        this.affixContainer.style.position = 'absolute';
        this.affixContainer.style.top = `${scrollBottom -
          (sidebarHeight + stickPosition + parentSpace)}px`;
        this.bindedBottom = false;
      }
      if (this.bindedTop && !this.bindedBottom && scrollingDown && !overlaps) {
        this.affixContainer.style.position = 'absolute';
        this.affixContainer.style.top = '0px';
        this.bindedTop = false;
      }
      if (overlaps && !scrollingDown) {
        this.affixContainer.style.position = 'absolute';
        this.affixContainer.style.top = 'auto';
        this.bindedTop = true;
      }
    }

    this.lastScroll = scrollTop;
  };

  render() {
    const { className } = this.props;
    return (
      <div
        className={className}
        style={{ height: 1 }}
        ref={relativeContainer => {
          this.relativeContainer = relativeContainer;
        }}
      >
        <div
          style={{ position: 'absolute' }}
          ref={affixContainer => {
            this.affixContainer = affixContainer;
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Affix;
