import React from 'react';
import PropTypes from 'prop-types';
import StickySidebar from 'sticky-sidebar';

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
    this.sidebar = new StickySidebar('#sidebar', {
      topSpacing: 77,
      containerSelector: '.container',
      innerWrapperSelector: '.sidebar__inner',
    });
  }

  // componentWillUnmount() {
  //   document.removeEventListener('scroll', this.handleScroll);
  //   if (this.ro) this.ro.unobserve(this.affixContainer);
  // }

  // handleScroll = () => {
  //   if (!this.relativeContainer || !this.affixContainer || !this.relativeContainer.offsetParent) {
  //     return;
  //   }

  //   const { stickPosition } = this.props;

  //   const windowHeight = document.body.clientHeight;
  //   const sidebarHeight = this.affixContainer.clientHeight;
  //   const scrollTop =
  //     window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  //   const scrollBottom = scrollTop + windowHeight;
  //   const scrollDiff = scrollTop - this.lastScroll;
  //   const scrollingDown = scrollDiff > 0;
  //   const parent = this.relativeContainer.offsetParent;
  //   const parentSpace = parent.offsetTop - stickPosition;

  //   const viewportOffset = this.affixContainer.getBoundingClientRect();

  //   const fits = windowHeight >= sidebarHeight + stickPosition;
  //   const overlaps = viewportOffset.top < parent.getBoundingClientRect().top;
  //   const shouldBindTop =
  //     viewportOffset.top >= stickPosition &&
  //     !scrollingDown &&
  //     !overlaps &&
  //     scrollTop >= parent.offsetTop - stickPosition;

  //   if (fits) {
  //     if (viewportOffset.top <= stickPosition) {
  //       this.affixContainer.style.position = 'fixed';
  //       this.affixContainer.style.top = `${stickPosition}px`;
  //     }

  //     if (overlaps && !scrollingDown) {
  //       this.affixContainer.style.position = 'absolute';
  //       this.affixContainer.style.top = 'auto';
  //     }
  //   } else {
  //     if (!this.bindedBottom && scrollingDown && viewportOffset.bottom <= windowHeight) {
  //       this.affixContainer.style.position = 'fixed';
  //       this.affixContainer.style.top = `${windowHeight - sidebarHeight}px`;
  //       this.bindedBottom = true;
  //     }
  //     if (shouldBindTop) {
  //       this.affixContainer.style.position = 'fixed';
  //       this.affixContainer.style.top = `${stickPosition}px`;
  //       this.bindedTop = true;
  //     }
  //     if (this.bindedBottom && !scrollingDown) {
  //       this.affixContainer.style.position = 'absolute';
  //       this.affixContainer.style.top = `${scrollBottom -
  //         (sidebarHeight + stickPosition + parentSpace)}px`;
  //       this.bindedBottom = false;
  //     }
  //     if (this.bindedTop && !this.bindedBottom && scrollingDown && !overlaps) {
  //       this.affixContainer.style.position = 'absolute';
  //       this.affixContainer.style.top = '0px';
  //       this.bindedTop = false;
  //     }
  //     if (overlaps && !scrollingDown) {
  //       this.affixContainer.style.position = 'absolute';
  //       this.affixContainer.style.top = 'auto';
  //       this.bindedTop = true;
  //     }
  //   }

  //   this.lastScroll = scrollTop;
  // };

  render() {
    return (
      <div id="sidebar">
        <div className="sidebar__inner">
          <p>This is sticky column</p>
        </div>
      </div>
    );
  }
}

export default Affix;
