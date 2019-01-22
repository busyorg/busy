import { connect } from 'react-redux';
import Body from '../../components/Story/Body';
import { getAppUrl, getRewriteLinks, getExitPageSetting } from '../../reducers';

export default connect(state => ({
  appUrl: getAppUrl(state),
  rewriteLinks: getRewriteLinks(state),
  exitPageSetting: getExitPageSetting(state),
}))(Body);
