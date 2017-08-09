/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import { expect } from 'chai';
import * as commentsTypes from './commentsActions';
import commentsReducers from './commentsReducer';

const initialStateMock = {};


describe('commentsReducer', function () {
  it('is expected to return an object', function () {
    expect(
      commentsReducers(undefined, {})
    ).to.be.an('object');
  });
  context(commentsTypes.GET_COMMENTS_SUCCESS, function () {
    it('is expected to add postId and commentsData to state', function () {
      const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const sampleAction = {
        type: commentsTypes.GET_COMMENTS_SUCCESS,
        meta: { id: 1 },
        payload: {
          content: mockData,
          postId: 42,
          rootCommentsList: mockData
        }
      };

      expect(
        commentsReducers({ current: 'state' }, sampleAction)
      ).to.deep.equal({
        current: 'state',
        listByCommentId: {},
        listByPostId: { 1: { hasMore: false, isFetching: false, list: mockData, show: 0 } },
        comments: { 1: { id: 1 }, 2: { id: 2 }, 3: { id: 3 }, 4: { id: 4 } }
      });
    });
  });
});
