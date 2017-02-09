import React from 'react';
import { connect } from 'react-redux';
import Header from '../app/Header';
import Loading from '../widgets/Loading';
import Error403 from '../statics/Error403';

@connect(
  state => ({
    auth: state.auth,
  })
)
export default class RequiredLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.auth.isFetching) {
      return (
        <div className="main-panel">
          <Header />
          <Loading />
        </div>
      );
    }
    if (!this.props.auth.isAuthenticated) {
      return <Error403 />;
    }
    return (
      React.cloneElement(this.props.children, { ...this.props })
    );
  }
}
