import React, { Component } from 'react';
import _ from 'lodash';
import steemAPI from '../steemAPI';
import Loading from '../widgets/Loading';
import Header from '../app/Header';
import Category from './Category';

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {},
    };
  }

  componentWillMount() {
    steemAPI.getState('tags', (err, result) => {
      this.setState({ categories: result.categories });
    });
  }

  render() {
    const categories = this.state.categories;
    return (
      <div className="main-panel">
        <Header />
        {!_.isEmpty(categories) && <ul>
          {_.values(_.sortBy(categories, 'discussions')).reverse().map((category, key) => {
            return (<Category key={key} category={category} />);
          })}
        </ul>}
        {_.isEmpty(categories) && <Loading />}
      </div>
    );
  }
};
