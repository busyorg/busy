import React from 'react';
import { Link } from 'react-router';
import Icon from './../../widgets/Icon';

const TriggerPost = ({ reblog, isReblogged, openCommentingDraft }) => {
  return (
    <div className="actions">
      <div className="triggers">
        <a className="trigger"><i className="icon icon-md material-icons">thumb_up</i></a>
        <a
          className="trigger"
          onClick={e => {
            e.stopPropagation();
            openCommentingDraft();
          }}
        >
          <Icon name="reply" />
        </a>
        <a
          className={isReblogged ? 'trigger active' : 'trigger'}
          onClick={reblog}
        >
          <Icon name="repeat" />
        </a>
      </div>
    </div>
  );
};

export default TriggerPost;
