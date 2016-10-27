import React, { Component } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'react-router';

export default class Category extends Component {
  render() {
    const category = this.props.category;
    return (
      <div className="page">
        <div className="block">
          <h1>
            <Link to={`/trending/${category.name}`}>#{category.name}</Link>
            {' '}<i className="icon icon-lg material-icons">star_border</i>
          </h1>
          <h2>
            <i className="icon icon-lg material-icons">library_books</i> {numeral(category.discussions).format('0,0')}
            {' '}<i className="icon icon-lg material-icons">attach_money</i> {numeral(category.total_payouts).format('$0,0')}
          </h2>
          <p>Last update {moment(category.last_update).fromNow()}</p>
        </div>
      </div>
    );
  }
};
