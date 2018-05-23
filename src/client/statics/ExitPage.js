import React from 'react';
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';
import { injectIntl, FormattedMessage } from 'react-intl';
import ActionLink from '../components/Button/ActionLink';
import ActionButton from '../components/Button/Action';
import './ExitPage.less';

@injectIntl
export default class ExitPage extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
  };

  closeWindow = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  };

  render() {
    const { intl, location } = this.props;

    const url = decodeURIComponent(new URLSearchParams(location.search).get('url'));

    if (!url) return <div />;

    return (
      <div className="ExitPage container">
        <h1 className="ExitPage__title">
          <FormattedMessage id="page_exit" defaultMessage="Hold on!" />
        </h1>
        <p className="ExitPage__content">
          <FormattedMessage
            id="page_exit_message"
            defaultMessage="Warning: this link might be unsafe, please double check the link before you proceed."
          />
        </p>
        <pre>{url}</pre>
        <div className="ExitPage__buttons">
          <ActionLink className="ExitPage__buttons__button" primary href={url}>
            <FormattedMessage id="page_exit_go" defaultMessage="Visit this website" />
          </ActionLink>
          <ActionButton
            className="ExitPage__buttons__button"
            text={intl.formatMessage({
              id: 'go_back',
              defaultMessage: 'Go back',
            })}
            onClick={this.closeWindow}
          />
        </div>
      </div>
    );
  }
}
