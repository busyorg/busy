import get from 'lodash/get';

export default function parseBlockchainError(error) {
  return (
    get(error, 'payload.error.data.stack[0].format')
      .split(':')
      .slice(-1)[0] || 'Unknown error'
  );
}
