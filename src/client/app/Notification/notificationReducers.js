import { message } from 'antd';
import { SHOW_NOTIFICATION } from './notificationActions';

const notifications = (state = [], action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      message[action.payload.context](action.payload.text);
      return state;
    default:
      return state;
  }
};

export default notifications;
