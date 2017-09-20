import React from 'react';
import { shallow } from 'enzyme';
import Replies from '../Replies';

describe('<Replies />', () => {
  it('should render without exploding', () => {
    const wrapper = shallow(<Replies />);
    expect(wrapper).toHaveLength(1);
  });
});
