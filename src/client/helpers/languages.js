export const getCountryCode = language => {
  const languages = {
    cmn: 'cn',
    spa: 'es',
    kor: 'kr',
  };
  return languages[language] ? languages[language] : language.substr(0, 2);
};

export default null;
