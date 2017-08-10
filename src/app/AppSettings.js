import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../actions';

@connect(
  state => ({
    app: state.app,
  }),
  dispatch =>
    bindActionCreators(
      {
        setLocale: actions.setLocale,
        setLayout: actions.setLayout,
      },
      dispatch,
    ),
)
export default class AppSettings extends React.Component {
  static propTypes = {
    app: PropTypes.shape().isRequired,
    setLayout: PropTypes.func,
    setLocale: PropTypes.func,
  };

  static defaultProps = {
    setLayout: () => {},
    setLocale: () => {},
  };

  render() {
    const { app, setLayout, setLocale } = this.props;
    return (
      <div className="main-panel">
        <div className="container my-5 text-center">
          <h1>
            <FormattedMessage id="settings" defaultMessage="Settings" />
          </h1>
          <h2>
            <FormattedMessage id="layout" defaultMessage="Layout" />
          </h2>
          <div className="row my-4">
            <div className="col-sm-4 mb-3">
              <a
                role="presentation"
                onClick={() => setLayout('card')}
                className={app.layout === 'card' && 'active'}
              >
                <h2 className="my-2">
                  <FormattedMessage id="card" defaultMessage="Card" />
                </h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a
                role="presentation"
                onClick={() => setLayout('list')}
                className={app.layout === 'list' && 'active'}
              >
                <h2 className="my-2">
                  <FormattedMessage id="list" defaultMessage="List" />
                </h2>
              </a>
            </div>
          </div>
          <h2>
            <FormattedMessage id="language" defaultMessage="Language" />
          </h2>
          <div className="row my-4">
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('en')}>
                <img className="Flag Flag--lg" alt="English" src="/img/flag/us.svg" />
                <h2 className="my-2">AE</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('zh')}>
                <img className="Flag Flag--lg" alt="简体中文" src="/img/flag/zh.svg" />
                <h2 className="my-2">简体中文</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('es')}>
                <img className="Flag Flag--lg" alt="Español" src="/img/flag/es.svg" />
                <h2 className="my-2">Español</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('fr')}>
                <img className="Flag Flag--lg" alt="Français" src="/img/flag/fr.svg" />
                <h2 className="my-2">Français</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('de')}>
                <img className="Flag Flag--lg" alt="Deutsch" src="/img/flag/de.svg" />
                <h2 className="my-2">Deutsch</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('ru')}>
                <img className="Flag Flag--lg" alt="Русский" src="/img/flag/ru.svg" />
                <h2 className="my-2">Русский</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('ko')}>
                <img className="Flag Flag--lg" alt="한국어" src="/img/flag/ko.svg" />
                <h2 className="my-2">한국어</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('nl')}>
                <img className="Flag Flag--lg" alt="Nederlands" src="/img/flag/nl.svg" />
                <h2 className="my-2">Nederlands</h2>
              </a>
            </div>
            <div className="col-sm-4 mb-3">
              <a role="presentation" onClick={() => setLocale('se')}>
                <img className="Flag Flag--lg" alt="Svenska" src="/img/flag/se.svg" />
                <h2 className="my-2">Svenska</h2>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
