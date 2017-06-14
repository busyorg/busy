import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

@connect(
  state => ({
    auth: state.auth,
  })
)
export default class TransferButton extends Component {
  static propTypes = {
    username: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { username, auth } = this.props;
    return (
      auth.isAuthenticated &&
        <Link to={`/transfer?to=${username}`} className="btn btn-sm btn-outline-secondary ml-2">
          <FormattedMessage id="transfer" defaultMessage="Transfer" />
        </Link>
    );
  }
}
