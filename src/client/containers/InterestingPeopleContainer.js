import { connect } from 'react-redux';
import { getRecommendations } from '../reducers';
import { updateRecommendations } from '../user/userActions';
import InterestingPeople from '../components/Sidebar/InterestingPeople';

const mapStateToProps = state => ({
  users: getRecommendations(state),
});

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(updateRecommendations()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InterestingPeople);
