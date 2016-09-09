import React from 'react';

export default ({ user, text }) => {
  return (
    <li className='message'>
      <span><b>@{ user }</b>: { text }</span>
    </li>
  );
}
