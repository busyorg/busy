import React from 'react';
import { shallow } from 'enzyme';
import { IReplies as Replies } from '../Replies';

describe('<Replies />', () => {
  it('should render without exploding', () => {
    const wrapper = shallow(<Replies />);
    expect(wrapper).toHaveLength(1);
  });
});
