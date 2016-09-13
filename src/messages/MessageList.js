import React from 'react';

export default ({ messages }) => {
  return (
    <div className="messages-content">
      <div className="container">
        <ul>
          { messages.map((message, i) =>
            <Message key={ i } user={ message.user } text={ message.text } />
          ) }
        </ul>
      </div>
    </div>
  );
}
