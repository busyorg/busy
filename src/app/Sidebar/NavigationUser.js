import { connect } from 'react-redux';
import { getAuthenticatedUserName } from '../../reducers';
import SidenavUser from '../../components/Navigation/SidenavUser';

export default connect(state => ({ username: getAuthenticatedUserName(state) }))(SidenavUser);
