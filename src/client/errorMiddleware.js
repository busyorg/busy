import { notify } from './app/Notification/notificationActions';

function parseBlockChainError(error) {
  if (error.indexOf('You may only post once every 5 minutes') !== -1) {
    return 'You may only post once every 5 minutes.';
  } else if (error.indexOf('You may only comment once every 20 seconds') !== -1) {
    return 'You may only comment once every 20 seconds.';
  } else if (error.indexOf('You have already voted in a similar way') !== -1) {
    return 'You have already voted in a similar way.';
  } else if (error.indexOf('Account has already reblogged this post') !== -1) {
    return 'You have already reblogged this post.';
  } else if (
    error.indexOf('<= (get_dynamic_global_properties().maximum_block_size - 256)') !== -1
  ) {
    return 'Your post is too big.';
  } else if (error.indexOf('bandwidth limit exceeded') !== -1) {
    return 'Your bandwith has been exceeded. Please wait to transact or power up STEEM.';
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
