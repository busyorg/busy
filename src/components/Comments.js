import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import Avatar from './Avatar';
import './Comments.less';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: 'BEST',
    };
  }

  handleSortClick = (e) => {
    const type = e.target.dataset.type;
    if (type) {
      this.setState({
        sort: type,
      });
    }
  };

  render() {
    return (
      <div className="Comments">
        <div className="Comments__sort" onClick={this.handleSortClick}>
          <a className={classNames({ active: this.state.sort === 'BEST' })} data-type="BEST">Best</a>
          <a className={classNames({ active: this.state.sort === 'TRENDING' })} data-type="TRENDING">Trending</a>
          <a className={classNames({ active: this.state.sort === 'NEWEST' })} data-type="NEWEST">Newest</a>
        </div>
        <div className="Comments__comment">
          <Avatar username="guest123" size={40} />
          <div className="Comments__comment__text">
            <Link to="guest123">
              guest123
            </Link>
            <span className="Comments__comment__date">
              <FormattedRelative value="2017-06-06T13:46:37Z" />
            </span>
            <div className="Comments__comment__content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </div>
      </div>);
  }
}

export default Comments;
