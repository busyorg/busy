/* eslint-disable prefer-arrow-callback, no-undef, import/no-extraneous-dependencies */
import { expect } from 'chai';
import * as authTypes from './authActions';
import authReducers from './authReducers';

const initialStateMock = {
  isAuthenticated: false,
  isFetching: false,
  user: {},
  token: '',
};


describe('authReducer', function () {
  it('is expected to return an object', function () {
    expect(
      authReducers(undefined, {})
    ).to.be.an('object');
  });
  it('is expected to return initial state on undefined action', function () {
    expect(
      authReducers(undefined, {})
    ).to.deep.equal(initialStateMock);
  });

  describe(`dispatching action ${authTypes.LOGIN_REQUEST}`, function () {
    it('is expected to return isFetching as true', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_REQUEST })
      ).to.have.property('isFetching').and.equal(true);
    });
    it('is expected to return isAuthenticated as false', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_REQUEST })
      ).to.have.property('isAuthenticated').and.equal(false);
    });
  });

  describe(`dispatching action ${authTypes.LOGIN_SUCCESS}`, function () {
    it('is expected to return isFetching as false', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_SUCCESS })
      ).to.have.property('isFetching').and.equal(false);
    });
    it('is expected to return isAuthenticated as true', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_SUCCESS })
      ).to.have.property('isAuthenticated').and.equal(true);
    });
    it('is expected to return user from the action', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_SUCCESS, user: 'testUser' })
      ).to.have.property('user').and.equal('testUser');
    });
  });

  describe(`dispatching action ${authTypes.LOGIN_FAILURE}`, function () {
    it('is expected to return isFetching as false', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_FAILURE })
      ).to.have.property('isFetching').and.equal(false);
    });
    it('is expected to return isAuthenticated as false', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_FAILURE })
      ).to.have.property('isAuthenticated').and.equal(false);
    });
    it('is expected to return errorMessage from action.message', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_FAILURE, message: 'testMessage' })
      ).to.have.property('errorMessage').and.equal('testMessage');
    });
  });

  describe(`dispatching action ${authTypes.LOGOUT_SUCCESS}`, function () {
    it('is expected to return isFetching as true', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGOUT_SUCCESS })
      ).to.have.property('isFetching').and.equal(true);
    });
    it('is expected to return isAuthenticated as false', function () {
      expect(
        authReducers(undefined, { type: authTypes.LOGOUT_SUCCESS })
      ).to.have.property('isAuthenticated').and.equal(false);
    });
  });
});
