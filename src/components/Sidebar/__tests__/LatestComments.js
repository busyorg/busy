import React from 'react';
import { shallow } from 'enzyme';
import LatestComments from '../LatestComments';

describe('<LatestComments />', () => {
  it('renders without exploding', () => {
    const props = {
      comments: [
        { id: 0, text: 'hello world', author: 'sekhmet', created: '2017-10-17T09:52:51' },
        { id: 1, text: 'hi Busy', author: 'fabien', created: '2017-10-11T10:52:51' },
      ],
    };
    const wrapper = shallow(<LatestComments {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
