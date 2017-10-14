import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { SAVE_SETTINGS_START, SAVE_SETTINGS_SUCCESS, saveSettings } from '../settingsActions';

jest.mock('sc2-sdk', () => ({
  me() {
    return Promise.resolve({
      user_metadata: {
        settings: {
          locale: 'pl',
          votingPower: 'on',
        },
      },
    });
  },
  updateUserMetadata(metadata) {
    return Promise.resolve({
      user_metadata: metadata,
    });
  },
}));

const middlewares = [
  promiseMiddleware({
    promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
  }),
  thunk,
];
const mockStore = configureStore(middlewares);

describe('settingsActions', () => {
  const initialState = {
    locale: 'auto',
    votingPower: 'auto',
    loading: false,
  };

  it('should save locale and votingPower', () => {
    const store = mockStore(initialState);
    const action = saveSettings({ locale: 'pl', votingPower: 'off' });

    const expectedActions = [
      { type: SAVE_SETTINGS_START },
      { type: SAVE_SETTINGS_SUCCESS, payload: { locale: 'pl', votingPower: 'off' } },
    ];

    return store.dispatch(action).then(() => {
      expect(store.getActions()).to.eql(expectedActions);
    });
  });
});
