import React from 'react';
import { shallow } from 'enzyme';
import UserWalletSummary from '../UserWalletSummary';

describe('(Component) UserWalletSummary', () => {
  describe('with default prop values', () => {
    it('renders and matches snapshot', () => {
      const props = {
        user: {
          balance: '100',
          vesting_shares: '0',
          savings_balance: '100 STEEM',
          savings_sbd_balance: '1000 STEEM',
        },
        estAccountValue: '100.00 STEEM',
        totalVestingShares: '100 STEEM',
        totalVestingFundSteem: '100 STEEM',
        loading: false,
      };
      const wrapper = shallow(<UserWalletSummary {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
