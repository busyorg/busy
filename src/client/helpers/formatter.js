export const jsonParse = str => {
  try {
    return jsonParse(JSON.parse(str));
  } catch (e) {
    return str;
  }
};

export const isJsonStr = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);

export default jsonParse;
