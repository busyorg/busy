import React from 'react';
import { connect } from 'react-redux';
import Body from '../../components/Story/Body';
import { getExitPageSetting } from '../../reducers';

const BodyContainer = props => <Body {...props} />;

export default connect(state => ({
  exitPageSetting: getExitPageSetting(state),
}))(BodyContainer);
