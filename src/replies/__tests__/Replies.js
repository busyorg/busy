import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IReplies as Replies } from '../Replies';
import Loading from '../../components/Icon/Loading';

describe('<Replies />', () => {
  it('should render without exploding', () => {
    const wrapper = shallow(<Replies authenticated={false} />);
    expect(wrapper).to.have.length(1);
  });

  it('should render <Loading /> when not authenticated', () => {
    const wrapper = shallow(<Replies authenticated={false} />);
    expect(wrapper.find(Loading)).to.have.length(1);
  });
});
