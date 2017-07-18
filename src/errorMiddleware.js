import _ from 'lodash';
import { notify } from './app/Notification/notificationActions';

function parseBlockChainError(error) {
  if (_.has(error, 'payload.error.data.stack[0].format')) {
    return error.payload.error.data.stack[0].format.split(':').slice(-1)[0];
  }
  return 'Unknown error';
}

export default function errorMiddleware({ dispatch }) {
  return next => (action) => {
    if (action.type && action.type.match(/error/i) && action.payload instanceof Error) {
      if (action.payload && action.payload.errors) {
        dispatch(notify(parseBlockChainError(action.payload.errors), 'error'));
      }
    }
    return next(action);
  };
}
