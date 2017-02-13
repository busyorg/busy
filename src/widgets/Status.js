import React from 'react';

const Status = ({ isOnline }) =>
  <span
    style={{
      borderRadius: '100%',
      display: 'inline-block',
      marginLeft: 5,
      width: 10,
      height: 10,
      backgroundColor: isOnline ? '#2ED8B1' : 'gray',
    }}
  />;

export default Status;
