import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../actions';
import Header from './Header';
import Icon from '../widgets/Icon';
import '../widgets/Flag.scss';

@connect(
  state => ({
    app: state.app,
  }),
  dispatch => bindActionCreators({
    setLocale: actions.setLocale,
    setLayout: actions.setLayout,
  }, dispatch)
)
export default class AppSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      app,
      setLayout,
      setLocale,
    } = this.props;
    return (
      <div className="main-panel">
        <Header />
        <div className="container my-5 text-center">
          <h1><FormattedMessage id="settings" /></h1>
          <h2><FormattedMessage id="layout" /></h2>
          <div className="row mhl">
            <div className="col col-lg-4 mb-3">
              <a
                onClick={() => setLayout('card')}
                className={app.layout === 'card' && 'active'}
              >
                <Icon name="view_agenda" xl />
                <h2 className="my-2">
                  <FormattedMessage id="card" />
                </h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a
                onClick={() => setLayout('list')}
                className={app.layout === 'list' && 'active'}
              >
                <Icon name="view_list" xl />
                <h2 className="my-2">
                  <FormattedMessage id="list" />
                </h2>
              </a>
            </div>
          </div>
          <h2><FormattedMessage id="language" /></h2>
          <div className="row mhl">
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('en')}>
                <img className="Flag Flag--lg" alt="English" src="/img/flag/us.svg" />
                <h2 className="my-2">English</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('zh')}>
                <img className="Flag Flag--lg" alt="简体中文" src="/img/flag/zh.svg" />
                <h2 className="my-2">简体中文</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('es')}>
                <img className="Flag Flag--lg" alt="Español" src="/img/flag/es.svg" />
                <h2 className="my-2">Español</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('fr')}>
                <img className="Flag Flag--lg" alt="Français" src="/img/flag/fr.svg" />
                <h2 className="my-2">Français</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('de')}>
                <img className="Flag Flag--lg" alt="Deutsch" src="/img/flag/de.svg" />
                <h2 className="my-2">Deutsch</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('ru')}>
                <img className="Flag Flag--lg" alt="Русский" src="/img/flag/ru.svg" />
                <h2 className="my-2">Русский</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('ko')}>
                <img className="Flag Flag--lg" alt="한국어" src="/img/flag/ko.svg" />
                <h2 className="my-2">한국어</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('nl')}>
                <img className="Flag Flag--lg" alt="Nederlands" src="/img/flag/nl.svg" />
                <h2 className="my-2">Nederlands</h2>
              </a>
            </div>
            <div className="col col-lg-4 mb-3">
              <a onClick={() => setLocale('se')}>
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
