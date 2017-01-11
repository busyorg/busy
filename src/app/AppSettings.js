import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../actions';
import Header from './Header';
import Icon from '../widgets/Icon';

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
        <div className="container my-3 text-center">
          <h1><FormattedMessage id="settings" /></h1>
          <h2><FormattedMessage id="layout" /></h2>
          <div className="row mhl">
            <div className="col col-lg-4 mbl">
              <a
                onClick={() => setLayout('card')}
                className={app.layout === 'card' && 'active'}
              >
                <Icon name="view_agenda" lg />
                <h2 className="mvs">
                  <FormattedMessage id="card" />
                </h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a
                onClick={() => setLayout('list')}
                className={app.layout === 'list' && 'active'}
              >
                <Icon name="view_list" lg />
                <h2 className="mvs">
                  <FormattedMessage id="list" />
                </h2>
              </a>
            </div>
          </div>
          <h2><FormattedMessage id="language" /></h2>
          <div className="row mhl">
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('en')}>
                <img className="Flag Flag--lg" alt="English" src="/img/flag/us.svg" />
                <h2 className="mvs">English</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('zh')}>
                <img className="Flag Flag--lg" alt="简体中文" src="/img/flag/zh.svg" />
                <h2 className="mvs">简体中文</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('fr')}>
                <img className="Flag Flag--lg" alt="Français" src="/img/flag/fr.svg" />
                <h2 className="mvs">Français</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('de')}>
                <img className="Flag Flag--lg" alt="Deutsch" src="/img/flag/de.svg" />
                <h2 className="mvs">Deutsch</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('ru')}>
                <img className="Flag Flag--lg" alt="Русский" src="/img/flag/ru.svg" />
                <h2 className="mvs">Русский</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('ko')}>
                <img className="Flag Flag--lg" alt="한국어" src="/img/flag/ko.svg" />
                <h2 className="mvs">한국어</h2>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
