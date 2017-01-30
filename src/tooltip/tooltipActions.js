import { createAction } from 'redux-actions';

export const SHOW_TOOLTIP = '@tooltip/SHOW_TOOLTIP';
export const HIDE_TOOLTIP = '@tooltip/HIDE_TOOLTIP';

export const showTooltip = createAction(SHOW_TOOLTIP);
export const hideTooltip = createAction(HIDE_TOOLTIP);
