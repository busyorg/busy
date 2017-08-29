import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getLocale } from '../reducers';
import * as actions from '../actions';

@connect(
  state => ({
    locale: getLocale(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        setLocale: actions.setLocale,
      },
      dispatch,
    ),
)
export default class AppSettings extends React.Component {
  static propTypes = {
    setLocale: PropTypes.func,
  };

  static defaultProps = {
    setLocale: () => {},
  };

  render() {
    const { setLocale } = this.props;
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
              <a role="presentation" onClick={() => setLocale('en')}>
                <h3>English</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('zh')}>
                <h3>简体中文</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('es')}>
                <h3>Español</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('fr')}>
                <h3>Français</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('pl')}>
                <h3>Polski</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('de')}>
                <h3>Deutsch</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('ru')}>
                <h3>Русский</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('ko')}>
                <h3>한국어</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('nl')}>
                <h3>Nederlands</h3>
              </a>
            </div>
            <div>
              <a role="presentation" onClick={() => setLocale('se')}>
                <h3>Svenska</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
