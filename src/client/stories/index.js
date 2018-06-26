import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IntlProvider } from 'react-intl';
import translations from '../locales/default.json';
import Action from '../components/Button/Action';
import Avatar from '../components/Avatar';
import BTooltip from '../components/BTooltip';
import ReputationTag from '../components/ReputationTag';
import Loading from '../components/Icon/Loading';
import SidebarWidget from '../components/Sidebar/SidebarWidget';
import '../styles/base.less';

const IntlDecorator = storyFn => (
  <IntlProvider locale="en" messages={translations}>
    {storyFn()}
  </IntlProvider>
);
const DefaultDecorator = storyFn => <div style={{ padding: 16 }}>{storyFn()}</div>;
const CenterDecorator = storyFn => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: 16,
    }}
  >
    {storyFn()}
  </div>
);

storiesOf('Action Button', module)
  .addDecorator(DefaultDecorator)
  .add('default', () => <Action onClick={action('clicked')}>Action Button</Action>)
  .add('primary', () => (
    <Action primary onClick={action('clicked')}>
      Action Button
    </Action>
  ))
  .add('big', () => (
    <Action big onClick={action('clicked')}>
      Action Button
    </Action>
  ))
  .add('loading', () => (
    <Action loading onClick={action('clicked')}>
      Action button
    </Action>
  ))
  .add('disabled', () => (
    <Action disabled onClick={action('clicked')}>
      Action button
    </Action>
  ));

storiesOf('Avatar', module)
  .addDecorator(DefaultDecorator)
  .add('small', () => <Avatar size={64} username="sekhmet" />)
  .add('big', () => <Avatar size={128} username="sekhmet" />);

storiesOf('BTooltip', module)
  .addDecorator(CenterDecorator)
  .add('default', () => <BTooltip title="This is tooltip">Hover me</BTooltip>);

storiesOf('ReputationTag', module)
  .addDecorator(IntlDecorator)
  .addDecorator(CenterDecorator)
  .add('default', () => <ReputationTag reputation="198532625245566" />);

storiesOf('Loading', module)
  .addDecorator(DefaultDecorator)
  .add('default', () => <Loading />);

storiesOf('Sidebar', module)
  .addDecorator(DefaultDecorator)
  .add('SidebarWidget', () => (
    <div style={{ maxWidth: 440 }}>
      <SidebarWidget icon="icon-wallet" title="Sample SidebarWidget">
        This is SidebarWidget content
      </SidebarWidget>
    </div>
  ))
  .add('SidebarWidget - refreshable', () => (
    <div style={{ maxWidth: 440 }}>
      <SidebarWidget refreshable title="Sample SidebarWidget" onRefresh={action('refresh')}>
        This is SidebarWidget content
      </SidebarWidget>
    </div>
  ))
  .add('SidebarWidget - with footer', () => (
    <div style={{ maxWidth: 440 }}>
      <SidebarWidget title="Sample SidebarWidget" footer={<a>See more</a>}>
        This is SidebarWidget content
      </SidebarWidget>
    </div>
  ));
