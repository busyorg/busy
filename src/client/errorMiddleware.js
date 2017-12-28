import { notify } from './app/Notification/notificationActions';

function parseBlockChainError(error) {
  let parsedError;
  try {
    parsedError = error
      .split(':')[2]
      .split('\n')[0]
      .substring(1);
  } catch (e) {
    parsedError = 'Unknown error';
  }

  return parsedError;
}

export default function errorMiddleware({ dispatch }) {
  return next => action => {
    if (action.type && action.type.match(/error/i) && action.payload instanceof Error) {
      if (action.payload && action.payload.error_description) {
        // Don't display error message for invalid_grant SDK error
        if (action.payload.error === 'invalid_grant') {
          return next(action);
        }
        dispatch(notify(parseBlockChainError(action.payload.error_description), 'error'));
      }
    }
    return next(action);
  };
}
