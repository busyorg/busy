import React from 'react';
import { shallow } from 'enzyme';
import ClaimReward from '../ClaimReward';

describe('(Component) ClaimReward', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        timestamp: '0',
        rewardTME: '0 TME',
        rewardTSD: '0 TSD',
        SCORErewardBalanceInTME: '0 SCORE',
        totalSCORE: '0',
        SCOREbackingTMEfundBalance: '0',
      };
      const wrapper = shallow(<ClaimReward {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
