import _ from 'lodash';
import { notify } from './app/Notification/notificationActions';

function parseBlockChainError(error) {
  let errorKey = error.message || '';
  let errorStr = '';
  if (error.message) {
    // ref https://github.com/steemit/condenser/blob/320860b4a2df26a3e7c5764b5bd9d0a754de664a/app/redux/Transaction.js#L82
    // Depends on FC_ASSERT formatting
    // https://github.com/steemit/steemit.com/issues/222
    const errLines = error.message.split('\n');
    if (errLines.length > 2) {
      errorKey = errLines[1];
      const txt = errorKey.split(': ');
      if (txt.length && txt[txt.length - 1].trim() !== '') {
        errorKey = errorStr = txt[txt.length - 1];
      } else {
        errorStr = `Transaction failed: ${errLines[1]}`;
      }
    } else {
      errorStr = errorKey;
    }
  }
  return errorStr;
}

export default function errorMiddleware({ dispatch }) {
  return next => (action) => {
    if (action.type && action.type.match(/error/i) && action.payload instanceof Error) {
      let message = action.payload.message; // get default error message
      const res = action.payload.res || action.payload.response; // get error messagr from response if exist

      // For XmlRequest
      message = _.get(res.body, 'error.message', message);

      // For Fetch request
      if (res && res.json) {
        res.json().then((error) => {
          if (_.has(error, 'error.payload.error')) {
            const msg = parseBlockChainError(error.error.payload.error);
            dispatch(notify(msg, 'error'));
          }
        });
      } else {
        dispatch(notify(message, 'error'));
      }
    }
    return next(action);
  };
}
