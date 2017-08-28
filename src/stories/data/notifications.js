import {
  NOTIFICATION_FOLLOWING,
  NOTIFICATION_REPLY,
  NOTIFICATION_TRANSFER,
  NOTIFICATION_MENTION,
} from '../../components/Navigation/Notifications/Notifications';

export default [
  {
    type: NOTIFICATION_FOLLOWING,
    id: 0,
    read: false,
    date: '2017-06-06T13:46:37Z',
    payload: {
      user: 'metrox',
    },
  },
  {
    type: NOTIFICATION_REPLY,
    id: 1,
    read: false,
    date: '2017-06-06T13:46:37Z',
    payload: {
      user: 'good-karma',
      post_url: 'https://google.com',
      post_title: 'post title',
    },
  },
  {
    type: NOTIFICATION_TRANSFER,
    id: 2,
    read: false,
    date: '2017-06-06T13:46:37Z',
    payload: {
      user: 'stabe',
      amount: 60.0,
    },
  },
  {
    type: NOTIFICATION_MENTION,
    id: 3,
    read: true,
    date: '2017-06-06T13:46:37Z',
    payload: {
      user: 'furion',
      post_url: 'https://google.com',
      post_title: 'post title',
    },
  },
  {
    type: NOTIFICATION_TRANSFER,
    id: 4,
    read: false,
    date: '2017-06-06T13:46:37Z',
    payload: {
      user: 'stabe',
      amount: 60.0,
    },
  },
  {
    type: NOTIFICATION_MENTION,
    id: 5,
    read: true,
    date: '2017-06-06T13:46:37Z',
    payload: {
      user: 'furion',
      post_url: 'https://google.com',
      post_title: 'post title',
    },
  },
];
