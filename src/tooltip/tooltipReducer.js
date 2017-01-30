import * as tooltipActions from './tooltipActions';

const initialState = {
  active: false,
  message: '',
  pos: {},
};

const tooltip = (state = initialState, action) => {
  switch (action.type) {
    case tooltipActions.SHOW_TOOLTIP:
      return action.payload;
    case tooltipActions.HIDE_TOOLTIP:
      return initialState;
    default:
      return state;
  }
};

export default tooltip;
