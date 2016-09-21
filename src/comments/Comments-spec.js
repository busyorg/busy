/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Comments from './Comments';
import CommentsList from './CommentsList';
import CommentItem from './CommentItem';
import { makeDOMEnvironment } from '../helpers/testHelpers';

const { expect } = chai;

makeDOMEnvironment();

// Mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

chai.use(chaiEnzyme());

describe('<Comments />', function () {
  const store = mockStore({ name: 'Pooria' });

  const wrapper = mount(<Comments store={store} />);

  it('is expected to have descendants  <CommentsList>', function () {
    expect(wrapper).to.have.descendants(CommentsList);
  });
});
