import React from 'react';
import { shallow } from 'enzyme';
import Action from '../Action';

describe('<Action />', () => {
  it('renders without exploding', () => {
    const props = {
      text: 'Example text',
      loading: true,
      disabled: false,
      primary: true,
      style: {},
      small: false,
    };
    const wrapper = shallow(<Action {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
