import React from 'react';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { injectIntl } from 'react-intl';
import Icon from '../widgets/Icon';

const BookmarkButton = ({ post, bookmarks, toggleBookmark, intl }) =>
  <OverlayTrigger
    placement="top"
    overlay={
      <Tooltip>
        {intl.formatMessage({ id: bookmarks[post.id] ? '@tooltip_remove_bookmark' : '@tooltip_add_bookmark' })}
      </Tooltip>}
  >
    <a onClick={() => toggleBookmark(post.id)} className="PostFeedList__cell__bookmark">
      <Icon
        name={bookmarks[post.id] ? 'bookmark' : 'bookmark_border'}
      />
    </a>
  </OverlayTrigger>;

export default injectIntl(BookmarkButton);
