
export const jsonParse = (str) => {
  let obj = {};
  try {
    obj = JSON.parse(str);
    obj = typeof obj === 'object' ? obj : JSON.parse(obj);
    obj = typeof obj === 'object' ? obj : {};
  } catch (e) { }
  return obj;
};
