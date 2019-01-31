import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import USSDDisplay from '../Utils/USDDisplay';

const getWrapper = value =>
  mount(
    <IntlProvider locale="en">
      <USSDDisplay value={value} />
    </IntlProvider>,
  );

describe('<USSDDisplay />', () => {
  it('shows positive numbers properly', () => {
    const wrapper = getWrapper(44.36125);
    expect(wrapper.text()).toEqual('$44.36');
  });

  it('handle small positive numbers < $0.02 properly', () => {
    const wrapper = getWrapper(0.017);
    expect(wrapper.text()).toEqual('$0.017');
  });

  it('handles negative values properly', () => {
    const wrapper = getWrapper(-1.33);
    expect(wrapper.text()).toEqual('-$1.33');
  });

  it('handle small negative numbers properly.', () => {
    const wrapper = getWrapper(-0.001);
    expect(wrapper.text()).toEqual('-$0.001');
  });

  it('handle zero properly.', () => {
    const wrapper = getWrapper(0);
    expect(wrapper.text()).toEqual('$0.00');
  });

  it('handle negative zero properly.', () => {
    const wrapper = getWrapper(-0);
    expect(wrapper.text()).toEqual('$0.00');
  });
});
