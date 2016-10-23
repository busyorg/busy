/* global describe, it, before */
import Promise from 'bluebird';
import React, { PropTypes } from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { Provider, connect } from 'react-redux';
import { mount } from 'enzyme';

import * as appTypes from '../actions';
import actionDecorator from './actionDecorator';
import store from '../store';
import { makeDOMEnvironment } from './testHelpers';

chai.use(chaiEnzyme);

// Mock for actions.getConfig
function getConfigSuccess() {
  return (dispatch) => {
    const req = { type: appTypes.CONFIG_REQUEST };
    dispatch(req);
    process.nextTick(() => {
      const res = {
        type: appTypes.CONFIG_SUCCESS,
        config: {
          stuff: 'here', there: 'yo'
        }
      };
      dispatch(res);
    });
  };
}

describe('actionDecorator', () => {
  before(() => {
    makeDOMEnvironment();
  });

  it('returns a function', () => {
    expect(actionDecorator([])).to.be.instanceOf(Function);
  });

  describe('E2E test', () => {
    it('wrapping actions dispatches them to the context\'s store', (done) => {
      function TestComponent({ isLoading, config }) {
        if (isLoading) {
          return (
            <div>Loading...</div>
          );
        }

        return (
          <div>{JSON.stringify(config)}</div>
        );
      }

      TestComponent.propTypes = {
        isLoading: PropTypes.bool,
        config: PropTypes.object
      };

      TestComponent = actionDecorator(
        getConfigSuccess
      )(TestComponent);

      TestComponent = connect(state => ({
        config: state.app.config
      }))(TestComponent);

      const wrapper = mount(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );

      expect(wrapper).to.have.text('Loading...');
      setTimeout(() => {
        expect(wrapper).to.have.text(JSON.stringify({
          stuff: 'here',
          there: 'yo'
        }));
        done();
      }, 10);
    });

    it('allows hash usage', () => {
      function Posts({ isLoading, loadResults }) {
        const posts = loadResults.posts;
        const users = loadResults.users;
        return (
          <div>
            {isLoading
              ? 'Loading...'
              : `Posts: ${JSON.stringify(posts)} Users: ${JSON.stringify(users)}`
            }
          </div>
        );
      }

      Posts.propTypes = {
        isLoading: PropTypes.bool,
        loadResults: PropTypes.object
      };

      Posts = actionDecorator({
        users: () => Promise.delay(20).then(() => [
          { name: 'Joe' },
          { name: 'John' }
        ]),
        posts: () => Promise.delay(10).then(() => [
          { stuff: 'here' },
          { stuff: 'there' }
        ])
      })(Posts);

      const wrapper = mount(
        <Posts />
      );
      expect(wrapper).to.have.text('Loading...');
      setTimeout(() => {
        expect(wrapper).to.have.text('Joe');
        expect(wrapper).to.have.text('here');
        expect(wrapper).to.have.text('there');
        expect(wrapper).to.have.text('Users:');
        expect(wrapper).to.have.text('Posts:');
      }, 100);
    });

    it('there\'s granular load indication', () => {
      function Posts({ isLoadingMap }) {
        return (
          <div>
            {JSON.stringify(isLoadingMap)}
          </div>
        );
      }

      Posts.propTypes = {
        isLoadingMap: PropTypes.object
      };

      Posts = actionDecorator({
        users: () => Promise.delay(20).then(() => [
          { name: 'Joe' },
          { name: 'John' }
        ]),
        posts: () => Promise.delay(10).then(() => [
          { stuff: 'here' },
          { stuff: 'there' }
        ])
      })(Posts);

      const wrapper = mount(
        <Posts />
      );
      expect(wrapper).to.have.text(JSON.stringify({
        users: true,
        posts: true
      }));
      setTimeout(() => {
        expect(wrapper).to.have.text(JSON.stringify({
          users: true,
          posts: false
        }));
        setTimeout(() => {
          expect(wrapper).to.have.text(JSON.stringify({
            users: false,
            posts: false
          }));
        }, 20);
      }, 10);
    });
  });
});
