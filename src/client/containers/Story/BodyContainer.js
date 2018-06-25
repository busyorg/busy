import { connect } from 'react-redux';
import Body from '../../components/Story/Body';
import { getExitPageSetting } from '../../reducers';

export default connect(state => ({
  exitPageSetting: getExitPageSetting(state),
}))(Body);
