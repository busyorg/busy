import Promise from 'bluebird';
import SteemConnect from 'sc2-sdk';
import omit from 'lodash/omit';

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

export const addDraftMetadata = draft => getMetadata()
  .then(metadata =>
    SteemConnect.updateUserMetadata({
      ...metadata,
      drafts: {
        ...metadata.drafts,
        [draft.id]: draft.postData,
      },
    }),
  )
  .then(resp => resp.user_metadata.drafts[draft.id]);

export const deleteDraftMetadata = draftId => getMetadata()
  .then(metadata =>
    SteemConnect.updateUserMetadata({
      ...metadata,
      drafts: omit(metadata.drafts, draftId),
    }),
  )
  .then(resp => resp.user_metadata.drafts);

export default getMetadata;
