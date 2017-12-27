import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import './Topic.less';

class Topic extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    favorite: PropTypes.bool,
    closable: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    favorite: false,
    closable: false,
    onClose: () => {},
  };

  state = {
    closing: false,
  };

  onCloseOver = () => {
    this.setState({
      closing: true,
    });
  };

  onCloseOut = () => {
    this.setState({
      closing: false,
    });
  };

  onCloseClick = e => {
    e.preventDefault();
    this.props.onClose(this.props.name);
  };

  render() {
    const { name, favorite, closable } = this.props;

    return (
      <Link
        className={classNames('Topic', {
          'Topic--favorite': favorite,
          'Topic--closing': this.state.closing,
        })}
        to={`/trending/${name}`}
      >
        {name}
        {closable && (
          <i
            role="presentation"
            className="iconfont icon-close Topic__close"
            onClick={this.onCloseClick}
            onMouseOver={this.onCloseOver}
            onMouseOut={this.onCloseOut}
          />
        )}
      </Link>
    );
  }
}

export default Topic;
