import _ from 'lodash';
import errors from '../common/constants/errors';
import { notify } from './app/Notification/notificationActions';

function parseBlockChainError(error) {
  const errorType = _.find(errors, e => _.includes(error, e.fingerprint));

  if (_.has(errorType, 'message')) {
    return errorType.message;
  }

  // Log error to console for further investigation.
  console.log('Unknown error', error);
  return 'Unkown error has occured.';
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
