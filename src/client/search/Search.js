import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getSearchResults, getSearchLoading } from '../reducers';
import { searchAskSteem } from './searchActions';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import SearchResultEmptyMessage from './SearchResultEmptyMessage';
import Affix from '../components/Utils/Affix';
import './Search.less';
import SearchResultPostPreview from './SearchResultPostPreview';
import SearchResultUserPreview from './SearchResultUserPreview';

@connect(
  state => ({
    searchResults: getSearchResults(state),
    loading: getSearchLoading(state),
  }),
  {
    searchAskSteem,
  },
)
class Search extends React.Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.shape()),
    searchAskSteem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    searchResults: [],
  };

  componentDidMount() {
    const searchQuery = _.get(this.props.location.state, 'query', '');
    this.props.searchAskSteem(searchQuery);
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
    return _.map(searchResults, (result) => {
      switch (result.type) {
        case 'post':
          return (
            <SearchResultPostPreview
              key={`${result.author}/${result.permlink}`}
              author={result.author}
              created={result.created}
              title={result.title}
              summary={result.summary}
              permlink={result.permlink}
              tags={result.tags}
            />
          );
        case 'user':
          return <SearchResultUserPreview key={result.name} username={result.name} />;
        default:
          return null;
      }
    });
  }

  render() {
    const { searchResults } = this.props;
    const noSearchResults = _.isEmpty(searchResults);

    return (
      <div className="settings-layout container">
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
            {this.renderSearchResult()}
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
