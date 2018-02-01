import assert from 'assert';
import Cookie from 'js-cookie';
import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';
import { addDraftMetadata, deleteDraftMetadata } from '../../helpers/metadata';
import { jsonParse } from '../../helpers/formatter';
import { rewardsValues } from '../../../common/constants/rewards';
import { createPermlink, getBodyPatchIfSmaller } from '../../vendor/steemitHelpers';
import { saveSettings } from '../../settings/settingsActions';

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';
export const SAVE_DRAFT_START = '@editor/SAVE_DRAFT_START';
export const SAVE_DRAFT_SUCCESS = '@editor/SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_ERROR = '@editor/SAVE_DRAFT_ERROR';

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const DELETE_DRAFT_START = '@editor/DELETE_DRAFT_START';
export const DELETE_DRAFT_SUCCESS = '@editor/DELETE_DRAFT_SUCCESS';
export const DELETE_DRAFT_ERROR = '@editor/DELETE_DRAFT_ERROR';

export const ADD_EDITED_POST = '@editor/ADD_EDITED_POST';
export const addEditedPost = createAction(ADD_EDITED_POST);

export const DELETE_EDITED_POST = '@editor/DELETE_EDITED_POST';
export const deleteEditedPost = createAction(DELETE_EDITED_POST);

export const saveDraft = (post, redirect) => dispatch => {
  if (redirect) dispatch(push(`/editor?draft=${post.id}`));
  return dispatch({
    type: SAVE_DRAFT,
    payload: {
      promise: addDraftMetadata(post),
    },
    meta: { postId: post.id },
  });
};

export const deleteDraft = draftIds => dispatch =>
  dispatch({
    type: DELETE_DRAFT,
    payload: {
      promise: deleteDraftMetadata(draftIds),
    },
    meta: { ids: draftIds },
  });

export const editPost = post => dispatch => {
  const jsonMetadata = jsonParse(post.json_metadata);
  const draft = {
    ...post,
    originalBody: post.body,
    jsonMetadata,
    isUpdating: true,
  };
  dispatch(saveDraft({ postData: draft, id: post.id })).then(() =>
    dispatch(push(`/editor?draft=${post.id}`)),
  );
};

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(
  ',',
);

const broadcastComment = (
  steemConnectAPI,
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  reward,
  upvote,
  permlink,
  referral,
  authUsername,
) => {
  const operations = [];
  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: '1000000.000 SBD',
    percent_steem_dollars: 10000,
  };

  if (reward === rewardsValues.none) {
    commentOptionsConfig.max_accepted_payout = '0.000 SBD';
  } else if (reward === rewardsValues.all) {
    commentOptionsConfig.percent_steem_dollars = 0;
  }

  if (referral && referral !== authUsername) {
    commentOptionsConfig.extensions = [
      [
        0,
        {
          beneficiaries: [{ account: referral, weight: 1000 }],
        },
      ],
    ];
  }

  if (reward === rewardsValues.none || reward === rewardsValues.all || referral) {
    operations.push(['comment_options', commentOptionsConfig]);
  }

  if (upvote) {
    operations.push([
      'vote',
      {
        voter: author,
        author,
        permlink,
        weight: 10000,
      },
    ]);
  }

  return steemConnectAPI.broadcast(operations);
};

export function createPost(postData) {
  requiredFields.forEach(field => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch, getState, { steemConnectAPI }) => {
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      jsonMetadata,
      reward,
      upvote,
      draftId,
      isUpdating,
    } = postData;
    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink);
    const state = getState();
    const authUser = state.auth.user;
    const newBody = isUpdating ? getBodyPatchIfSmaller(postData.originalBody, body) : body;

    dispatch(saveSettings({ upvoteSetting: upvote, rewardSetting: reward }));

    let referral;
    if (Cookie.get('referral')) {
      const accountCreatedDaysAgo =
        (new Date().getTime() - new Date(`${authUser.created}Z`).getTime()) / 1000 / 60 / 60 / 24;
      if (accountCreatedDaysAgo < 30) {
        referral = Cookie.get('referral');
      }
    }

    dispatch({
      type: CREATE_POST,
      payload: {
        promise: getPermLink.then(permlink =>
          broadcastComment(
            steemConnectAPI,
            parentAuthor,
            parentPermlink,
            author,
            title,
            newBody,
            jsonMetadata,
            !isUpdating && reward,
            !isUpdating && upvote,
            permlink,
            referral,
            authUser.name,
          ).then(result => {
            if (draftId) {
              dispatch(deleteDraft(draftId));
              dispatch(addEditedPost(permlink));
            }
            dispatch(push(`/${parentPermlink}/@${author}/${permlink}`));

            if (window.analytics) {
              window.analytics.track('Post', {
                category: 'post',
                label: 'submit',
                value: 10,
              });
            }
            return result;
          }),
        ),
      },
    });
  };
}
