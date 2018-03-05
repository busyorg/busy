import { expect } from 'chai';
import * as authTypes from '../authActions';
import authReducer from '../authReducer';

const initialStateMock = {
  isAuthenticated: false,
  isFetching: false,
  isReloading: false,
  loaded: false,
  user: {},
  userSCMetaData: {},
};

describe('authReducer', () => {
  it('is expected to return an object', () => {
    expect(authReducer(undefined, {})).to.be.an('object');
  });
  it('is expected to return initial state on undefined action', () => {
    expect(authReducer(undefined, {})).to.deep.equal(initialStateMock);
  });

  describe(`dispatching action ${authTypes.LOGIN_START}`, () => {
    it('is expected to return isFetching as true', () => {
      expect(authReducer(undefined, { type: authTypes.LOGIN_START }))
        .to.have.property('isFetching')
        .and.equal(true);
    });
    it('is expected to return isAuthenticated as false', () => {
      expect(authReducer(undefined, { type: authTypes.LOGIN_START }))
        .to.have.property('isAuthenticated')
        .and.equal(false);
    });
  });

  describe(`dispatching action ${authTypes.LOGIN_SUCCESS}`, () => {
    it('is expected to return isFetching as false', () => {
      expect(
        authReducer(undefined, { type: authTypes.LOGIN_SUCCESS, payload: { account: 'testUser' } }),
      )
        .to.have.property('isFetching')
        .and.equal(false);
    });
    it('is expected to return isAuthenticated as true', () => {
      expect(
        authReducer(undefined, { type: authTypes.LOGIN_SUCCESS, payload: { account: 'testUser' } }),
      )
        .to.have.property('isAuthenticated')
        .and.equal(true);
    });
    it('is expected to return user from the action', () => {
      expect(
        authReducer(undefined, { type: authTypes.LOGIN_SUCCESS, payload: { account: 'testUser' } }),
      )
        .to.have.property('user')
        .and.equal('testUser');
    });
  });

  describe(`dispatching action ${authTypes.LOGIN_ERROR}`, () => {
    it('is expected to return isFetching as false', () => {
      expect(authReducer(undefined, { type: authTypes.LOGIN_ERROR }))
        .to.have.property('isFetching')
        .and.equal(false);
    });
    it('is expected to return isAuthenticated as false', () => {
      expect(authReducer(undefined, { type: authTypes.LOGIN_ERROR }))
        .to.have.property('isAuthenticated')
        .and.equal(false);
    });
  });

  describe(`dispatching action ${authTypes.LOGOUT_SUCCESS}`, () => {
    it('is expected to return isAuthenticated as false', () => {
      expect(authReducer(undefined, { type: authTypes.LOGOUT_SUCCESS }))
        .to.have.property('isAuthenticated')
        .and.equal(false);
    });
  });
});
