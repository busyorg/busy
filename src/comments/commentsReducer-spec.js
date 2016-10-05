/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import { expect } from 'chai';
import * as commentsTypes from './commentsActionTypes';
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
      const commentsDataMock = [1, 2, 3, 4];
      const sampleAction = {
        type: commentsTypes.GET_COMMENTS_SUCCESS,
        payload: {
          commentsData: commentsDataMock,
          postId: 42
        }
      };

      expect(
        commentsReducers({ current: 'state' }, sampleAction)
      ).to.deep.equal({ current: 'state', '42': commentsDataMock });
    });
  });
});
