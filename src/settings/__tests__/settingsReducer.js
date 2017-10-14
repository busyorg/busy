import { expect } from 'chai';
import settingsReducer from '../settingsReducer';
import * as settingsTypes from '../settingsActions';

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
});
