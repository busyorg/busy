import React from 'react';
import { FormattedRelative, FormattedTime } from 'react-intl';
import { Link } from 'react-router';

import Body from '../post/Body';
import Avatar from '../widgets/Avatar';
import ProfileTooltipOrigin from '../user/profileTooltip/ProfileTooltipOrigin';

const Message = (props) => {
  const { model } = props;
  const sentAt = model[0].sentAt;
  const senderUsername = (model[0].senderUsername || model[0].sentBy);
  return (
    <div className="Message message">
      <div className="container">
        <div data-uuid={model[0].uuid}>
          <div className="Message__left">
            <ProfileTooltipOrigin username={senderUsername}>
              <Link to={`/@${senderUsername}`}>
                <Avatar sm username={senderUsername} />
              </Link>
            </ProfileTooltipOrigin>
          </div>
          <div className="ml-5">
            <div className="media-heading">
              <b>
                <ProfileTooltipOrigin username={senderUsername}>
                  <Link to={`/@${senderUsername}`}>
                    {senderUsername}
                  </Link>
                </ProfileTooltipOrigin>
              </b>{' '}
              <span className="text-info">
                <FormattedRelative value={sentAt} />{' '}
                (<FormattedTime value={sentAt} />)
              </span>
            </div>
            <Body body={model[0].text} />
          </div>
        </div>
      </div>

      {model.slice(1).map((message, i) => {
        const { text, uuid, sentAt: msentAt } = message;
        return (
          <div className="Message__item container" key={i} data-uuid={uuid}>
            <div className="Message__timestamp">
              <FormattedTime value={new Date(msentAt)} />
            </div>

            <div className="ml-5">
              <Body body={text} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Message;
