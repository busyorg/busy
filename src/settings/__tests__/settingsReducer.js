import { expect } from 'chai';
import settingsReducer, { getIsLoading, getLocale, getVotingPower } from '../settingsReducer';
import * as settingsTypes from '../settingsActions';
import * as authTypes from '../../auth/authActions';

describe('settingsReducer', () => {
  const initialState = {
    locale: 'auto',
    votingPower: 'auto',
    loading: false,
  };

  it('should return initial state', () => {
    const stateBefore = undefined;
    const stateAfter = initialState;
    const action = {};

    expect(settingsReducer(stateBefore, action)).to.eql(stateAfter);
  });

  it('should not change on unknown action', () => {
    const stateBefore = initialState;
    const stateAfter = stateBefore;
    const action = { type: 'UNKNOWN_ACTION_TYPE' };

    expect(settingsReducer(stateBefore, action)).to.eql(stateAfter);
  });

  it('should set loading to true when saving', () => {
    const stateBefore = initialState;
    const stateAfter = {
      ...stateBefore,
      loading: true,
    };
    const action = {
      type: settingsTypes.SAVE_SETTINGS_START,
    };

    expect(settingsReducer(stateBefore, action)).to.eql(stateAfter);
  });

  it('should set loading to false after saving failed', () => {
    const stateBefore = {
      ...initialState,
      loading: true,
    };
    const stateAfter = {
      ...stateBefore,
      loading: false,
    };
    const action = {
      type: settingsTypes.SAVE_SETTINGS_ERROR,
    };

    expect(settingsReducer(stateBefore, action)).to.eql(stateAfter);
  });

  it('should set locale, voting power and loading after saving succeeded', () => {
    const stateBefore = {
      ...initialState,
      loading: true,
    };
    const stateAfter = {
      ...stateBefore,
      loading: false,
      locale: 'pl',
      votingPower: 'on',
    };
    const action = {
      type: settingsTypes.SAVE_SETTINGS_SUCCESS,
      payload: {
        locale: 'pl',
        votingPower: 'on',
      },
    };

    expect(settingsReducer(stateBefore, action)).to.eql(stateAfter);
  });

  it('should set locale and voting power after login success', () => {
    const stateBefore = initialState;
    const stateAfter = {
      ...stateBefore,
      locale: 'fr',
      votingPower: 'off',
    };
    const action = {
      type: authTypes.LOGIN_SUCCESS,
      payload: {
        user_metadata: {
          settings: {
            locale: 'fr',
            votingPower: 'off',
          },
        },
      },
    };

    expect(settingsReducer(stateBefore, action)).to.eql(stateAfter);
  });
});

describe('settingsReducer selectors', () => {
  const stateVar1 = {
    locale: 'auto',
    votingPower: 'auto',
    loading: false,
  };

  const stateVar2 = {
    locale: 'pl',
    votingPower: 'off',
    loading: true,
  };

  it('should return locale', () => {
    expect(getLocale(stateVar1)).to.equal('auto');
    expect(getLocale(stateVar2)).to.equal('pl');
  });

  it('should return voting power', () => {
    expect(getVotingPower(stateVar1)).to.equal('auto');
    expect(getVotingPower(stateVar2)).to.equal('off');
  });

  it('should return loading', () => {
    expect(getIsLoading(stateVar1)).to.equal(false);
    expect(getIsLoading(stateVar2)).to.equal(true);
  });
});
