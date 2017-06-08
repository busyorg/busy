import React from 'react';
import classNames from 'classnames';
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
      </div>);
  }
}

export default Comments;
