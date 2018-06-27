import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import translations from '../locales/default.json';
import { drafts, people, posts } from './data';
import Action from '../components/Button/Action';
import Avatar from '../components/Avatar';
import BTooltip from '../components/BTooltip';
import ReputationTag from '../components/ReputationTag';
import Loading from '../components/Icon/Loading';
import BaseWidget from '../components/Widgets/BaseWidget';
import PeopleWidget from '../components/Widgets/PeopleWidget';
import LastDraftsWidget from '../components/Widgets/LastDraftsWidget';
import PostsWidgets from '../components/Widgets/PostsWidget';
import ClaimRewardsWidget from '../components/Widgets/ClaimRewardsWidget';
import '../styles/base.less';

const IntlDecorator = storyFn => (
  <IntlProvider locale="en" messages={translations}>
    {storyFn()}
  </IntlProvider>
);
const RouterDecorator = storyFn => <MemoryRouter initialEntries={['/']}>{storyFn()}</MemoryRouter>;
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
const WidgetDecorator = storyFn => <div style={{ maxWidth: 440 }}>{storyFn()}</div>;

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
  .addDecorator(IntlDecorator)
  .addDecorator(RouterDecorator)
  .addDecorator(DefaultDecorator)
  .addDecorator(WidgetDecorator)
  .add('BaseWidget', () => (
    <BaseWidget icon="icon-wallet" title="Sample SidebarWidget">
      This is SidebarWidget content
    </BaseWidget>
  ))
  .add('BaseWidget - refreshable', () => (
    <BaseWidget refreshable title="Sample SidebarWidget" onRefresh={action('refresh')}>
      This is SidebarWidget content
    </BaseWidget>
  ))
  .add('BaseWidget - with footer', () => (
    <BaseWidget title="Sample SidebarWidget" footer={<a>See more</a>}>
      This is SidebarWidget content
    </BaseWidget>
  ))
  .add('PeopleWidget', () => <PeopleWidget people={people} onRefresh={action('refresh')} />)
  .add('LastDraftsWidget', () => <LastDraftsWidget drafts={drafts} />)
  .add('PostsWidget', () => <PostsWidgets posts={posts} />)
  .add('ClaimRewardsWidget', () => (
    <ClaimRewardsWidget steem={21.12} sbd={0} sp={11.442} onClaim={action('claim')} />
  ));
