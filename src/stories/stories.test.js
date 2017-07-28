import initStoryshots from '@storybook/addon-storyshots';

Date.now = jest.fn(() => 1499334522047);

initStoryshots();
