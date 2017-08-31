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
});
