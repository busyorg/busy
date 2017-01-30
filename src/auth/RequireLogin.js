import React from 'react';
import { connect } from 'react-redux';
import Header from '../app/Header';
import Loading from '../widgets/Loading';
import Error404 from '../statics/Error404';

@connect(
  state => ({
    auth: state.auth,
  })
)
export default class UserProfile extends React.Component {
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
      return <Error404 />;
    }
    return (
      React.cloneElement(this.props.children, { ...this.props })
    );
  }
}
