import Promise from 'bluebird';
import SteemConnect from 'sc2-sdk';

Promise.promisifyAll(SteemConnect, { context: SteemConnect });

const getMetadata = () => SteemConnect.me().then(resp => resp.user_metadata);

export const setLocaleMetadata = locale => getMetadata()
  .then(metadata =>
    SteemConnect.updateUserMetadata({
      ...metadata,
      locale,
    }),
  )
  .then(resp => resp.user_metadata.locale);

export default getMetadata;
