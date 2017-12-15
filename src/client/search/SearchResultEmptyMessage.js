import React from 'react';
import { FormattedMessage } from 'react-intl';

const SearchResultEmptyMessage = () => (
  <div className="Search__message-container">
    <FormattedMessage
      id="no_search_results_found"
      defaultMessage="No results were found for your search."
    />
  </div>
);

export default SearchResultEmptyMessage;
