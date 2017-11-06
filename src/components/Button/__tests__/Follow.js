import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { FollowPure as Follow } from '../Follow';

describe('<Follow />', () => {
  it('renders without exploding', () => {
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const props = {
      intl,
      isFollowed: true,
      pending: false,
    };
    const wrapper = shallow(<Follow {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
