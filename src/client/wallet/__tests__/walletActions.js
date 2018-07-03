import * as actions from '../walletActions';

describe('walletActions', () => {
  it('should create an action to open a transfer', () => {
    const username = 'sekhmet';
    const expectedAction = {
      type: actions.OPEN_TRANSFER,
      payload: username,
    };

    expect(actions.openTransfer(username)).toEqual(expectedAction);
  });

  it('should create an action to close a transfer', () => {
    const expectedAction = {
      type: actions.CLOSE_TRANSFER,
    };

    expect(actions.closeTransfer()).toEqual(expectedAction);
  });

  it('should create an action to open a power up modal', () => {
    const expectedAction = {
      type: actions.OPEN_POWER_UP_OR_DOWN,
      payload: false,
    };

    expect(actions.openPowerUpOrDown(false)).toEqual(expectedAction);
  });

  it('should create an action to open a power down modal', () => {
    const expectedAction = {
      type: actions.OPEN_POWER_UP_OR_DOWN,
      payload: true,
    };

    expect(actions.openPowerUpOrDown(true)).toEqual(expectedAction);
  });

  it('should create an action to close a transfer', () => {
    const expectedAction = {
      type: actions.CLOSE_POWER_UP_OR_DOWN,
    };

    expect(actions.closePowerUpOrDown()).toEqual(expectedAction);
  });
});
