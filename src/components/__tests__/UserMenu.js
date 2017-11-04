import React from 'react';
import { shallow } from 'enzyme';
import UserMenu from '../UserMenu';

describe('<UserMenu />', () => {
  it('renders without exploding', () => {
    const props = {
      defaultKey: 'comments',
      followers: 42,
      following: 21,
    };
    const wrapper = shallow(<UserMenu {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
