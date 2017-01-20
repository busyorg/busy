import React from 'react';
import { FormattedRelative } from 'react-intl';
import Avatar from '../widgets/Avatar';

function Message(props) {
  const { model } = props;
  const sentAt = model[0].sentAt;
  const senderUsername = (model[0].senderUsername || model[0].sentBy);

  return (
    <li className="Message message">
      <div className="container">
        <div data-uuid={model[0].uuid}>
          <div className="Message__left">
            <Avatar sm username={senderUsername} />
          </div>
          <div className="ml-5">
            <div className="media-heading">
              <b>{senderUsername}</b>
              {' '}
              <span className="text-info">
                <FormattedRelative value={sentAt} />
              </span>
            </div>
            <p>{model[0].text}</p>
          </div>
        </div>
      </div>

      {
        model.slice(1).map(({ uuid, text }, i) => (
          <div className="container" key={i} data-uuid={uuid}>
            <div className="ml-5">
              <p>{text}</p>
            </div>
          </div>
        ))
      }
    </li>
  );
}

export default Message;
