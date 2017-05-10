import React from 'react';
import { injectIntl } from 'react-intl';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';
import Icon from '../widgets/Icon';

const BookmarkButton = ({ post, bookmarks, toggleBookmark, intl }) =>
  <SimpleTooltipOrigin message={
    intl.formatMessage({
      id: bookmarks[post.id]
        ? '@tooltip_remove_bookmark'
        : '@tooltip_add_bookmark',
      defaultMessage: bookmarks[post.id] ?
        'Remove from bookmarks' :
        'Add in bookmarks',
    })}
  >
    <a onClick={() => toggleBookmark(post.id)} className="PostFeedList__cell__bookmark">
      <Icon
        name={bookmarks[post.id] ? 'bookmark' : 'bookmark_border'}
      />
    </a>
  </SimpleTooltipOrigin>;

export default injectIntl(BookmarkButton);
