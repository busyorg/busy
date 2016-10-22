import { SHOW_NOTIFICATION, CLOSE_NOTIFICATION } from './notificationActions';

const notifications = (state = [], action) => {
  switch(action.type) {
    case SHOW_NOTIFICATION:
      return [
        {
          notifId: action.payload.notifId,
          text: action.payload.text,
        },
        ...state,
      ];
    case CLOSE_NOTIFICATION:
      return state.filter(notif => notif.notifId !== action.payload.notifId);
    default:
      return state;
  }
};

export default notifications;
