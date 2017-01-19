import React, { Component, PropTypes } from 'react';
import { Origin } from 'redux-tooltip';
import { connect } from 'react-redux';
import { injectIntl, IntlProvider } from 'react-intl';
import ProfileTooltip from './ProfileTooltip';
import * as messages from '../../translations/Translations';

@connect(
  state => ({
    app: state.app,
  })
)
@injectIntl
export default class ProfileTooltipOrigin extends Component {
  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.username !== this.props.username;
  }

  renderTooltipContent() {
    const { app } = this.props;
    return (
      <IntlProvider locale={app.locale} messages={messages[app.locale]}>
        <ProfileTooltip
          username={this.props.username}
          store={this.context.store}
        />
      </IntlProvider>
    );
  }

  render() {
    return (
      <Origin
        name="userProfile"
        content={this.renderTooltipContent()}
        delay={500}
        delayOn="both"
      >
        { this.props.children }
      </Origin>
    );
  }
}
