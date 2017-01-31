import React from 'react';
import { FormattedRelative } from 'react-intl';
import Body from '../post/Body';
import Avatar from '../widgets/Avatar';

const Message = (props) => {
  const { model } = props;
  const sentAt = model[0].sentAt;
  const senderUsername = (model[0].senderUsername || model[0].sentBy);
  return (
    <div className="Message message">
      <div className="container">
        <div data-uuid={model[0].uuid}>
          <div className="Message__left">
            <Avatar sm username={senderUsername} />
          </div>
          <div className="ml-5">
            <div className="media-heading">
              <b>{senderUsername}</b>{' '}
              <span className="text-info">
                <FormattedRelative value={sentAt} />
              </span>
            </div>
            <Body body={model[0].text} />
          </div>
        </div>
      </div>
      {model.slice(1).map(({ uuid, text }, i) =>
        <div className="container" key={i} data-uuid={uuid}>
          <div className="ml-5">
            <Body body={text} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
