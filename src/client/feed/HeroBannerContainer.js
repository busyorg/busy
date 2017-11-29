import { connect } from 'react-redux';
import HeroBanner from '../components/HeroBanner';
import { getIsAuthenticated, getIsLoaded, getIsBannerClosed } from '../reducers';
import { closeBanner } from '../app/appActions';

export default connect(
  state => ({
    visible: !getIsAuthenticated(state) && getIsLoaded(state) && !getIsBannerClosed(state),
  }),
  dispatch => ({
    onCloseClick: () => dispatch(closeBanner()),
  }),
)(HeroBanner);
