export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

export const isJsonStr = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);
