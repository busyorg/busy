jest.mock('rc-animate');
jest.mock('rc-tabs');
jest.mock('rc-select');

jest.mock('react-dom', () => ({
  findDOMNode() {
    return null;
  },
}));
