import React from 'react';
import { FormattedMessage } from 'react-intl';
import 'url-search-params-polyfill';
import ActionLink from '../components/Button/ActionLink';
import ActionButton from '../components/Button/Action';
import './ExitPage.less';

export default class ExitPage extends React.Component {
  closeWindow = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  };

  render() {
    const url = new URLSearchParams(location.search).get('url');

    if (!url) {
      return null;
    }

    return (
      <div className="ExitPage container">
        <h1 className="ExitPage__title">
          <FormattedMessage id="page_exit" defaultMessage="You are leaving Busy.org" />
        </h1>
        <p className="ExitPage__content">
          <FormattedMessage
            id="page_exit_message"
            defaultMessage="You are about to go to external website. Please be careful when sharing your credentials."
          />
        </p>
        <pre>{url}</pre>
        <div className="ExitPage__buttons">
          <ActionLink className="ExitPage__buttons__button" primary href={url}>
            <FormattedMessage id="page_exit_go" defaultMessage="Visit this website" />
          </ActionLink>
          <ActionButton
            className="ExitPage__buttons__button"
            text="Go back"
            onClick={this.closeWindow}
          />
        </div>
      </div>
    );
  }
}
