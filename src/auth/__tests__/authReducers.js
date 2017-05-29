import { expect } from 'chai';
import * as authTypes from '../authActions';
import authReducers from '../authReducers';

const initialStateMock = {
  isAuthenticated: false,
  isFetching: false,
  user: {},
  token: '',
};

describe('authReducer', () => {
  it('is expected to return an object', () => {
    expect(
      authReducers(undefined, {})
    ).to.be.an('object');
  });
  it('is expected to return initial state on undefined action', () => {
    expect(
      authReducers(undefined, {})
    ).to.deep.equal(initialStateMock);
  });

  describe(`dispatching action ${authTypes.LOGIN_REQUEST}`, () => {
    it('is expected to return isFetching as true', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_REQUEST })
      ).to.have.property('isFetching').and.equal(true);
    });
    it('is expected to return isAuthenticated as false', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_REQUEST })
      ).to.have.property('isAuthenticated').and.equal(false);
    });
  });

  describe(`dispatching action ${authTypes.LOGIN_SUCCESS}`, () => {
    it('is expected to return isFetching as false', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_SUCCESS })
      ).to.have.property('isFetching').and.equal(false);
    });
    it('is expected to return isAuthenticated as true', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_SUCCESS })
      ).to.have.property('isAuthenticated').and.equal(true);
    });
    it('is expected to return user from the action', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_SUCCESS, user: 'testUser' })
      ).to.have.property('user').and.equal('testUser');
    });
  });

  describe(`dispatching action ${authTypes.LOGIN_FAILURE}`, () => {
    it('is expected to return isFetching as false', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_FAILURE })
      ).to.have.property('isFetching').and.equal(false);
    });
    it('is expected to return isAuthenticated as false', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_FAILURE })
      ).to.have.property('isAuthenticated').and.equal(false);
    });
    it('is expected to return errorMessage from action.message', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGIN_FAILURE, message: 'testMessage' })
      ).to.have.property('errorMessage').and.equal('testMessage');
    });
  });

  describe(`dispatching action ${authTypes.LOGOUT_SUCCESS}`, () => {
    it('is expected to return isFetching as true', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGOUT_SUCCESS })
      ).to.have.property('isFetching').and.equal(true);
    });
    it('is expected to return isAuthenticated as false', () => {
      expect(
        authReducers(undefined, { type: authTypes.LOGOUT_SUCCESS })
      ).to.have.property('isAuthenticated').and.equal(false);
    });
  });
});
