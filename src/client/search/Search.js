import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import _ from 'lodash';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getSearchResults, getSearchLoading } from '../reducers';
import { searchAskSteem } from './searchActions';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import SearchResultEmptyMessage from './SearchResultEmptyMessage';
import Affix from '../components/Utils/Affix';
import Loading from '../components/Icon/Loading';
import SearchResultPostPreview from './SearchResultPostPreview';
import SearchResultUserPreview from './SearchResultUserPreview';
import './Search.less';

@injectIntl
@connect(
  state => ({
    searchResults: getSearchResults(state),
    searchLoading: getSearchLoading(state),
  }),
  {
    searchAskSteem,
  },
)
class Search extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.shape()),
    searchLoading: PropTypes.bool.isRequired,
    searchAskSteem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    searchResults: [],
  };

  componentDidMount() {
    const searchQuery = _.get(this.props.location.state, 'query', '');
    if (!_.isEmpty(searchQuery)) {
      this.props.searchAskSteem(searchQuery);
    } else {
      const searchQueryRegexResults = this.props.location.search.match(/\?q=(.*)/);
      const searchQueryFromUrl = _.get(searchQueryRegexResults, 1, '');
      this.props.searchAskSteem(searchQueryFromUrl);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldSearchQuery = _.get(this.props.location.state, 'query', '');
    const newSearchQuery = _.get(nextProps.location.state, 'query', '');

    if (oldSearchQuery !== newSearchQuery) {
      this.props.searchAskSteem(newSearchQuery);
    }
  }

  renderSearchResult() {
    const { searchResults } = this.props;
    return _.map(searchResults, (result, i) => {
      switch (result.type) {
        case 'post':
          return (
            <SearchResultPostPreview
              key={`${i}/${result.author}/${result.permlink}`}
              author={result.author}
              created={result.created}
              title={result.title}
              summary={result.summary}
              permlink={result.permlink}
              tags={result.tags}
            />
          );
        case 'user':
          return <SearchResultUserPreview key={`${i}/${result.name}`} username={result.name} />;
        default:
          return null;
      }
    });
  }

  render() {
    const { intl, searchResults, searchLoading } = this.props;
    const noSearchResults = _.isEmpty(searchResults) && !searchLoading;

    return (
      <div className="settings-layout container">
        <Helmet>
          <title>{intl.formatMessage({ id: 'search', defaultMessage: 'Search' })} - Busy</title>
        </Helmet>
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className="center">
          <h1 className="Search__title">
            <FormattedMessage id="search_results" defaultMessage="Search results" />
          </h1>
          <div className="Search">
            {noSearchResults && <SearchResultEmptyMessage />}
            {searchLoading ? <Loading style={{ marginTop: '20px' }} /> : this.renderSearchResult()}
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
