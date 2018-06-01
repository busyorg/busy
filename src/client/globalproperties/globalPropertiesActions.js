import { createAsyncActionType } from '../helpers/stateHelpers';
import { getDynamicGlobalProperties } from '../helpers/apiHelpers';

export const GET_GLOBAL_PROPERTIES = createAsyncActionType(
  '@globalProperties/GET_GLOBAL_PROPERTIES',
);

export const getGlobalProperties = () => dispatch =>
  dispatch({
    type: GET_GLOBAL_PROPERTIES.ACTION,
    payload: {
      promise: getDynamicGlobalProperties(),
    },
  });
