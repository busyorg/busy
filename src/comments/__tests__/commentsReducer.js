import { expect } from 'chai';
import * as commentsTypes from '../commentsActions';
import commentsReducers from '../commentsReducer';

describe('commentsReducer', () => {
  it('is expected to return an object', () => {
    expect(
      commentsReducers(undefined, {})
    ).to.be.an('object');
  });
  describe(commentsTypes.GET_COMMENTS_SUCCESS, () => {
    it('is expected to add postId and commentsData to state', () => {
      const commentsDataMock = [1, 2, 3, 4];
      const sampleAction = {
        type: commentsTypes.GET_COMMENTS_SUCCESS,
        payload: {
          commentsData: commentsDataMock,
          postId: 42,
          content: '',
          rootCommentsList: []
        },
        meta: {
          id: 42
        }
      };

      expect(
        commentsReducers({ current: 'state' }, sampleAction)
      ).to.deep.equal({
        current: 'state',
        comments: {},
        listByPostId: { 42: { list: [], show: 0, isFetching: false, hasMore: false } },
        listByCommentId: {}
      });
    });
  });
});
