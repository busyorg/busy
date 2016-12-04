import React, { Component } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'react-router';

import Icon from '../widgets/Icon';

export default class Category extends Component {
  render() {
    const category = this.props.category;
    return (
      <div className="page">
        <center className="my-3">
          <h1>
            <Link to={`/hot/${category.name}`}>#{category.name}</Link>{' '}
            <Icon name="star_border" lg />
          </h1>
          <h2>
            <Icon name="library_books" lg /> {numeral(category.discussions).format('0,0')}{' '}
            <Icon name="attach_money" lg /> {numeral(category.total_payouts).format('$0,0')}
          </h2>
          <p>Last update {moment(category.last_update).fromNow()}</p>
        </center>
      </div>
    );
  }
};
