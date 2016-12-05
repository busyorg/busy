import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { setLocale } from '../actions';
import Header from './Header';

@connect(
  state => ({
    app: state.app,
  }),
  dispatch => bindActionCreators({
    setLocale,
  }, dispatch)
)

export default class AppSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { setLocale } = this.props;
    return (
      <div className="main-panel">
        <Header />
        <center className="container ptl">
          <h1><FormattedMessage id="settings" /></h1>
          <h2><FormattedMessage id="language" /></h2>
          <div className="row mhl">
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('en')}>
                <img className="flag flag-lg" alt="English" src="/img/flag/us.svg" />
                <h2 className="mvs">English</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('cn')}>
                <img className="flag flag-lg" alt="简体中文" src="/img/flag/cn.svg" />
                <h2 className="mvs">简体中文</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('fr')}>
                <img className="flag flag-lg" alt="Français" src="/img/flag/fr.svg" />
                <h2 className="mvs">Français</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('de')}>
                <img className="flag flag-lg" alt="Deutsch" src="/img/flag/de.svg" />
                <h2 className="mvs">Deutsch</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('ru')}>
                <img className="flag flag-lg" alt="Русский" src="/img/flag/ru.svg" />
                <h2 className="mvs">Русский</h2>
              </a>
            </div>
            <div className="col col-lg-4 mbl">
              <a onClick={() => setLocale('kr')}>
                <img className="flag flag-lg" alt="한국어" src="/img/flag/kr.svg" />
                <h2 className="mvs">한국어</h2>
              </a>
            </div>
          </div>
        </center>
      </div>
    );
  }
}
