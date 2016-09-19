/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import Comments from './Comments';
import CommentsList from './CommentsList';

const { expect } = chai;

chai.use(chaiEnzyme());

const wrapper = shallow(<Comments />);

describe('<Comments />', function () {
  it('is expected to have descendants <CommentsList>', function () {
    expect(wrapper).to.have.descendants(CommentsList);
  });
});
