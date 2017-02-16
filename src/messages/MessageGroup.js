import React from 'react';
import { FormattedTime } from 'react-intl';
import { Link } from 'react-router';
import Body from '../post/Body';
import Avatar from '../widgets/Avatar';
import { ProfileTooltipOrigin } from '../tooltip/ProfileTooltip';

const MessageGroup = (props) => {
  const { model } = props;
  const receivedAt = model[0].receivedAt;
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
                <FormattedTime value={receivedAt} />
              </span>
            </div>
            <Body body={model[0].text} />
          </div>
        </div>
      </div>

      {model.slice(1).map((message, i) => {
        const { text, uuid, receivedAt: mreceivedAt } = message;
        return (
          <div className="Message__item container" key={i} data-uuid={uuid}>
            <div className="Message__timestamp">
              <FormattedTime value={new Date(mreceivedAt)} />
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

export default MessageGroup;
