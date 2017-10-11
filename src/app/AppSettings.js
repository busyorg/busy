import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';
import { getLocale, getIsLocaleLoading, getIsReloading } from '../reducers';
import { setLocale } from './appActions';
import { reload } from '../auth/authActions';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';

@connect(
  state => ({
    reloading: getIsReloading(state),
    locale: getLocale(state),
    localeLoading: getIsLocaleLoading(state),
  }),
  { reload, setLocale },
)
export default class AppSettings extends React.Component {
  static propTypes = {
    reloading: PropTypes.bool,
    locale: PropTypes.string,
    localeLoading: PropTypes.bool,
    setLocale: PropTypes.func,
    reload: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    locale: 'auto',
    localeLoading: false,
    setLocale: () => {},
    reload: () => {},
  };

  componentDidMount() {
    this.props.reload();
  }

  languages = {
    en: 'English',
    zh: '简体中文',
    cs: 'Čeština',
    es: 'Español',
    fr: 'Français',
    pl: 'Polski',
    de: 'Deutsch',
    ru: 'Русский',
    ko: '한국어',
    nl: 'Nederlands',
    sv: 'Svenska',
    tr: 'Türkçe',
    ro: 'Română',
    id: 'Bahasa Indonesia',
    ja: '日本語',
    th: 'ภาษาไทย',
    lo: 'ພາສາລາວ',
  };

  handleLocaleChange = locale => this.props.setLocale(locale);

  render() {
    const { reloading, locale, localeLoading } = this.props;

    const languageOptions = [];

    if (locale === 'auto') {
      languageOptions.push(
        <Select.Option disabled value="auto">
          <FormattedMessage key="auto" id="select_language" defaultMessage="Select your language" />
        </Select.Option>,
      );
    }

    Object.keys(this.languages).forEach((key) => {
      languageOptions.push(
        <Select.Option key={key} value={key}>
          {this.languages[key]}
        </Select.Option>,
      );
    });

    return (
      <div className="shifted">
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <h1>
              <FormattedMessage id="settings" defaultMessage="Settings" />
            </h1>
            {reloading ? (
              <Loading center={false} />
            ) : (
              <div>
                <h2>
                  <FormattedMessage id="language" defaultMessage="Language" />
                </h2>
                <div>
                  <Select
                    disabled={localeLoading}
                    value={locale}
                    style={{ width: '100%', maxWidth: 240 }}
                    onChange={this.handleLocaleChange}
                  >
                    {languageOptions}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
