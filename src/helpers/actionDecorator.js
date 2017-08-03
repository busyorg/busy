import Promise from 'bluebird';
import React, { Component, PropTypes } from 'react';
import extend from 'lodash/extend';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

/**
 * Decorates a component with actions to be dispatched when it's mounted.
 *
 * @example
 *
 *     // Basic Usage
 *
 *     function Posts({ isLoading, loadResults }) {
 *       const posts = loadResults[0];
 *       return isLoading ? 'Loading...' : JSON.stringify(posts);
 *     }
 *
 *     Posts = actionDecorator(() => {
 *       return request.get('/api/posts').endAsync();
 *     })(Posts);
 *
 * @example
 *
 *     // Hash Usage
 *
 *     function Posts({ isLoading, loadResults }) {
 *       const posts = loadResults.posts;
 *       return isLoading ? 'Loading...' : JSON.stringify(posts);
 *     }
 *
 *     Posts = actionDecorator({
 *       posts: () => {
 *         return request.get('/api/posts').endAsync();
 *       }
 *     )(Posts);
 *
 */

export default function actionDecorator(...actions) {
  return (Wrapped, options) => class ActionComponent extends Component {
    static actions = actions;
    static Wrapped = Wrapped;

    static contextTypes = {
      store: PropTypes.object,
    };

    static propTypes = {
      location: PropTypes.object.isRequired,
      params: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {
        isLoading: !isEmpty(actions),
        isLoadingMap: this.getInitialResults(true),
        results: this.getInitialResults(),
      };
    }

    getInitialResults(initialValue = null) {
      let initialResults;
      if (!isFunction(actions[0])) {
        initialResults = mapValues(actions[0], () => initialValue);
      } else {
        initialResults = map(actions, () => initialValue);
      }
      return initialResults;
    }

    componentDidMount() {
      this.dispatchActions();
    }

    componentDidUpdate(prevProps) {
      if (!this._dispatched ||
          !isEqual(this.props.match.params, prevProps.match.params) ||
          !isEqual(this.props.location, prevProps.location)) {
        this.dispatchActions();
      }
    }

    dispatchActions() {
      if (!actions || !actions[0]) return;
      if (options && options.waitFor) {
        const state = this.context.store.getState();
        if (!options.waitFor(state)) {
          return;
        }
      }

      this._dispatched = true;
      const dispatch = (action, key) => {
        let ret;
        if (this.context.store) {
          ret = this.context.store.dispatch(action({
            params: this.props.match.params,
            location: this.props.location,
            props: this.props,
          }));
        } else {
          ret = action({
            params: this.props.match.params,
            location: this.props.location,
            props: this.props,
          });
        }
        ret.tap(() => {
          const update = {};
          update[key] = false;
          this.setState({
            isLoadingMap: extend(this.state.isLoadingMap, update),
          });
        });
        return ret;
      };

      let hasLoadedP;
      if (!isFunction(actions[0])) {
        hasLoadedP = Promise.props(mapValues(actions[0], dispatch));
      } else {
        hasLoadedP = Promise.map(actions, dispatch);
      }

      hasLoadedP
        .then((results) => {
          this.setState({
            results,
            isLoading: false,
            loadedAt: new Date(),
          });
        }, (err) => {
          this.setState({
            loadError: err,
            isLoading: false,
            loadedAt: new Date(),
          });
        });
    }

    render() {
      return (
        <Wrapped
          isLoading={this.state.isLoading}
          isLoadingMap={this.state.isLoadingMap}
          loadError={this.state.loadError}
          loadResults={this.state.results}
          {...this.props}
        />
      );
    }
  };
}
