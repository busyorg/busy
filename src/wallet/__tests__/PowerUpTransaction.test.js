import React from 'react';
import { shallow } from 'enzyme';
import PowerUpTransaction from '../PowerUpTransaction';

describe('(Component) PowerUpTransaction', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        timestamp: '0',
        amount: <span>{'0 STEEM'}</span>,
      };
      const wrapper = shallow(<PowerUpTransaction {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
