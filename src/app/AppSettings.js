import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getLocale } from '../reducers';
import { setLocale } from './appActions';

@connect(
  state => ({
    locale: getLocale(state),
  }),
  { setLocale },
)
export default class AppSettings extends React.Component {
  static propTypes = {
    setLocale: PropTypes.func,
  };

  static defaultProps = {
    setLocale: () => {},
  };

  render() {
    return (
      <div className="shifted">
        <div className="container">
          <h1>
            <FormattedMessage id="settings" defaultMessage="Settings" />
          </h1>
          <h2>
            <FormattedMessage id="language" defaultMessage="Language" />
          </h2>
          <div className="row my-4">
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('en')}>
                <h3>English</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('zh')}>
                <h3>简体中文</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('cs')}>
                <h3>Čeština</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('es')}>
                <h3>Español</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('fr')}>
                <h3>Français</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('pl')}>
                <h3>Polski</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('de')}>
                <h3>Deutsch</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('ru')}>
                <h3>Русский</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('ko')}>
                <h3>한국어</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('nl')}>
                <h3>Nederlands</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => this.props.setLocale('sv')}>
                <h3>Svenska</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
