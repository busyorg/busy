export const jsonParse = str => {
  try {
    return jsonParse(JSON.parse(str));
  } catch (e) {
    return str;
  }
};

export default jsonParse;
