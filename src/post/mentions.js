import React from 'react';
import { Link } from 'react-router';
import { has } from 'lodash/object';
import { size } from 'lodash/collection';

const Mentions = ({ jsonMetaData }) => {
  return (
    (has(jsonMetaData, 'users') && size(jsonMetaData.users) <= 5) ?
      <p><span>Mention{_.size(jsonMetaData.users) > 1 ? 's' : ''} </span>

        { jsonMetaData.users.map((user, key) =>
          <span key={key}>
            { key > 0 && (key + 1) !== jsonMetaData.users.length && <span>, </span> }
            { key !== 0 && (key + 1) === jsonMetaData.users.length && <span> and </span> }
            <Link to={`/@${user}`}>@{user}</Link>
          </span>
        )}

      </p>
      :
      null
  );
};

export default Mentions;
