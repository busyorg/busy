import { connect } from 'react-redux';
import HeroBanner from '../components/HeroBanner';
import { getIsAuthenticated, getIsLoaded } from '../reducers';

export default connect(
  state => ({
    visible: !getIsAuthenticated(state) && getIsLoaded(state),
  }),
  null,
)(HeroBanner);
