import React from 'react';
import { shallow } from 'enzyme';
import Topic from '../Topic';

describe('<Topic />', () => {
  it('renders without exploding', () => {
    const props = {
      name: 'exampletopic',
      favorite: true,
      closable: true,
    };
    const wrapper = shallow(<Topic {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
