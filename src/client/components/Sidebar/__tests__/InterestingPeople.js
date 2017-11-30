import React from 'react';
import { shallow } from 'enzyme';
import InterestingPeople from '../InterestingPeople';

describe('<InterestingPeople />', () => {
  it('renders without exploding', () => {
    const props = {
      users: [{ name: 'sekhmet' }, { name: 'fabien' }, { name: 'ekitcho' }, { name: 'jm90mm' }],
    };
    const wrapper = shallow(<InterestingPeople {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
