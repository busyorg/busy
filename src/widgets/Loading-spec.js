/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import Loading from './Loading';

const { expect } = chai;

chai.use(chaiEnzyme());

describe('<Loading />', function () {
  it('is expected to render a div', function () {
    const wrapper = shallow(<Loading />);
    return expect(wrapper.find('div')).to.exist;
  });
  describe('<Loading color="white"/>', function () {
    it('is expected to render .loading-white', function () {
      const wrapper = shallow(<Loading color="white" />);
      return expect(
        wrapper.find('.loading-white')
      ).to.exist;
    });
  });
  describe('<Loading color=""/>', function () {
    it('is expected to render .loading', function () {
      const wrapper = shallow(<Loading color="" />);
      return expect(
        wrapper.find('.loading')
      ).to.exist;
    });
  });
});
