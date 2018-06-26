import React from 'react';
import { shallow } from 'enzyme';
import Action from '../Action';

describe('<Action />', () => {
  it('renders without exploding', () => {
    const props = {
      loading: true,
      disabled: false,
      primary: true,
    };
    const wrapper = shallow(<Action {...props}>Example text</Action>);
    expect(wrapper).toMatchSnapshot();
  });
});
