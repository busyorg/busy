import React from 'react';
import { Link } from 'react-router';
import Avatar from './Avatar';
import Topic from './Button/Topic';
import './Story.less';

const Story = () =>
  <div className="Story">
    <i className="iconfont icon-unfold Story__more" />
    <div className="Story__header">
      <Avatar username="guest123" size={40} />
      <div className="Story__header__text">
        <Link to="/guest123">
          <h4>guest123</h4>
        </Link>
        <span className="Story__date">2 days ago</span>
      </div>
      <div className="Story__topics">
        <Topic name="food" />
        <Topic name="bangkok" />
      </div>
    </div>
    <div className="Story__content">
      <h2 className="Story__content__title">Grilled Frog Cooking Over Clay</h2>
      <p>Put a frog into a vessel fill with water and start heating the water.
As the temperature of the water begins to rise…</p>
      <img className="Story__content__image" src="https://placehold.it/520x400" alt="Bangkok" />
    </div>
    <div>
      Like
    </div>
  </div>;

export default Story;
