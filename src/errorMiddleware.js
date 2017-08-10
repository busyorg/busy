import { notify } from './app/Notification/notificationActions';

function parseBlockChainError(error) {
  return error.split(':').slice(-1)[0];
}

export default function errorMiddleware({ dispatch }) {
  return next => (action) => {
    if (action.type && action.type.match(/error/i) && action.payload instanceof Error) {
      if (action.payload && action.payload.error_description) {
        dispatch(notify(parseBlockChainError(action.payload.error_description), 'error'));
      }
    }
    return next(action);
  };
}
