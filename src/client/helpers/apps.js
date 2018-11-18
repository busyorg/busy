const appsList = require('weschemajs/apps.json');

const apps = {};

Object.keys(appsList).forEach(key => {
  apps[key] = appsList[key].name;
});

export default apps;
