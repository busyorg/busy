// get full application list from scripts json.
const appsList = require('steemscript/apps.json');

// start an empty object for the applications names.
const apps = {};

// "map" each one extracting the name key
Object.keys(appsList).forEach(key => {
  apps[key] = appsList[key].name;
});

// export the result.
export default apps;
