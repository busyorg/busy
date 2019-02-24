import { connect } from 'react-redux';
import { getIsAuthFetching } from '../reducers';
import PostRecommendation from '../components/Sidebar/PostRecommendation';

const mapStateToProps = state => ({
  isAuthFetching: getIsAuthFetching(state),
});

export default connect(mapStateToProps)(PostRecommendation);
