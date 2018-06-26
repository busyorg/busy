import { configure } from '@storybook/react';

function loadStories() {
  require('../src/client/stories/index.js');
}

configure(loadStories, module);
