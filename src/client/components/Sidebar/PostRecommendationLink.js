import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedNumber, FormattedRelative } from 'react-intl';
import { getFromMetadata } from '../../helpers/parser';
import { getProxyImageURL } from '../../helpers/image';
import { image } from '../../vendor/steemitLinks';

const PostRecommendationLink = ({ post, navigateToPost, navigateToPostComments }) => {
  const images = getFromMetadata(post.json_metadata, 'image');
  const firstImage = _.head(images);
  let imagePath = '';

  if (images && firstImage) {
    imagePath = getProxyImageURL(firstImage, 'small');
  } else {
    const bodyImg = post.body.match(image());
    if (bodyImg && bodyImg.length) {
      imagePath = getProxyImageURL(bodyImg[0], 'small');
    }
  }

  return (
    <div className="PostRecommendation__link" key={post.id}>
      <div>
        <div className="PostRecommendation__link__header">
          <Link role="presentation" to={`/@${post.author}`}>
            <span className="PostRecommendation__link__author username">{post.author}</span>
          </Link>
          <span className="PostRecommendation__link__bullet" />
          <FormattedRelative value={`${post.created}Z`} />
        </div>
        <Link
          to={`/@${post.author}/${post.permlink}`}
          onClick={() => navigateToPost(post.author)}
          className="PostRecommendation__link__post-title"
        >
          {post.title}
        </Link>
        {post.children > 0 && (
          <Link
            to={`/@${post.author}/${post.permlink}#comments`}
            onClick={navigateToPostComments}
            className="PostRecommendation__comments"
          >
            <i className="PostRecommendation__comments__icon iconfont icon-message_fill" />
            {post.children === 1 ? (
              <FormattedMessage
                id="comment_count"
                values={{ count: <FormattedNumber value={post.children} /> }}
                defaultMessage="{count} comment"
              />
            ) : (
              <FormattedMessage
                id="comments_count"
                values={{ count: <FormattedNumber value={post.children} /> }}
                defaultMessage="{count} comments"
              />
            )}
          </Link>
        )}
      </div>
      <div className="PostRecommendation__link__image-container">
        <Link
          to={`/${post.category}/@${post.author}/${post.permlink}`}
          onClick={() => navigateToPost(post.author)}
          className="PostRecommendation__link__post-title"
        >
          <img alt="" src={imagePath} className="PostRecommendation__link__image" />
        </Link>
      </div>
    </div>
  );
};

PostRecommendationLink.propTypes = {
  post: PropTypes.shape(),
  navigateToPost: PropTypes.func,
  navigateToPostComments: PropTypes.func,
};

PostRecommendationLink.defaultProps = {
  post: {},
  navigateToPost: () => {},
  navigateToPostComments: () => {},
};

export default PostRecommendationLink;
