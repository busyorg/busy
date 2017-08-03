import Promise from 'bluebird';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

/**
 * Created (copied) from actionDecorator.js from @yamadapc and changed the API to fit the needs
 * the main reason was to provide ownProps to actions to separate concerns and use waitFor
 * to accomodate dispatching functions after certain state changes (e.g after auth)
 *
 */

export default function dispatchActions(options = {}, actions) {
  return Wrapped => class ActionComponent extends Component {
    static actions = actions;
    static Wrapped = Wrapped;

    static contextTypes = {
      store: PropTypes.object,
    };

    constructor(props) {
      super(props);

      this.state = {
        isLoading: !_.isEmpty(actions),
      };
    }

    componentDidMount() {
      this.dispatchActions();
    }

    componentDidUpdate(prevProps) {
      if (!this._dispatched ||
        !_.isEqual(this.props.match.params, prevProps.match.params) ||
        !_.isEqual(this.props.location, prevProps.location)) {
        this.dispatchActions();
      }
    }

    dispatchActions() {
      if (!_.isFunction(actions)) return;
      if (options && options.waitFor) {
        const state = this.context.store.getState();
        if (!options.waitFor(state)) {
          return;
        }
      }

      this._dispatched = true;
      const dispatch = (action) => {
        if (this.context.store) {
          this.context.store.dispatch(action());
        }
      };

      let hasLoadedP;
      if (_.isFunction(actions)) {
        const actionsMap = actions(this.props);
        hasLoadedP = Promise.props(_.mapValues(actionsMap, dispatch));
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
          loadError={this.state.loadError}
          {...this.props}
        />
      );
    }
  };
}
