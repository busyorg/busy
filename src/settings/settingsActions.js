import { saveSettingsMetadata } from '../helpers/metadata';

export const SAVE_SETTINGS = '@app/SAVE_SETTINGS';
export const SAVE_SETTINGS_START = '@app/SAVE_SETTINGS_START';
export const SAVE_SETTINGS_SUCCESS = '@app/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_ERROR = '@app/SAVE_SETTINGS_ERROR';

export const saveSettings = settings => dispatch =>
  dispatch({
    type: SAVE_SETTINGS,
    payload: {
      promise: saveSettingsMetadata(settings),
    },
  });
