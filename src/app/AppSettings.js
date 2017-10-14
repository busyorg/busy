import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Select, Radio } from 'antd';
import { getLocale, getIsLocaleLoading, getIsReloading } from '../reducers';
import { setLocale } from './appActions';
import { reload } from '../auth/authActions';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import './AppSettings.less';

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

  state = {
    votingPower: 'auto',
  };

  componentDidMount() {
    this.props.reload();
  }

  languages = {
    en: 'English',
    id: 'Bahasa Indonesia - Indonesian',
    ms: 'Bahasa Melayu - Malay',
    cs: 'Čeština - Czech',
    da: 'Dansk - Danish',
    de: 'Deutsch - German',
    es: 'Español - Spanish',
    fil: 'Filipino',
    fr: 'Français - French',
    it: 'Italiano - Italian',
    nl: 'Nederlands - Dutch',
    no: 'Norsk - Norwegian',
    pl: 'Polski - Polish',
    pt: 'Português - Portuguese',
    ro: 'Română - Romanian',
    sl: 'Slovenščina - Slovenian',
    sv: 'Svenska - Swedish',
    vi: 'Tiếng Việt - Vietnamese',
    tr: 'Türkçe - Turkish',
    el: 'Ελληνικά - Greek',
    bg: 'Български език - Bulgarian',
    ru: 'Русский - Russian',
    uk: 'Українська мова - Ukrainian',
    he: 'עִבְרִית - Hebrew',
    ar: 'العربية - Arabic‏',
    hi: 'हिन्दी - Hindi',
    lo: 'ພາສາລາວ - Lao',
    th: 'ภาษาไทย - Thai',
    ko: '한국어 - Korean',
    ja: '日本語 - Japanese',
    zh: '简体中文 - Simplified Chinese',
    // zh: '繁體中文 - Traditional Chinese',
  };

  handleLocaleChange = locale => this.props.setLocale(locale);
  handleVotingPowerChange = event => this.setState({ votingPower: event.target.value });

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
              <div className="AppSettings">
                <div className="AppSettings_section">
                  <h3>
                    <FormattedMessage id="voting_power" defaultMessage="Voting Power" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="voting_power_info"
                      defaultMessage="You can enable Voting Power slider to specify exact percentage of your Voting Power to use for upvote."
                    />
                  </p>
                  <Radio.Group
                    value={this.state.votingPower}
                    onChange={this.handleVotingPowerChange}
                  >
                    <Radio value="off">
                      <FormattedMessage id="voting_power_off" defaultMessage="Disable slider" />
                    </Radio>
                    <Radio value="on">
                      <FormattedMessage id="voting_power_on" defaultMessage="Enable slider" />
                    </Radio>
                    <Radio value="auto">
                      <FormattedMessage
                        id="voting_power_auto"
                        defaultMessage="Enable and disable slider depending on my Voting Power"
                      />
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="AppSettings_section">
                  <h3>
                    <FormattedMessage id="language" defaultMessage="Language" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="language_info"
                      defaultMessage="What language do you want to use on Busy?"
                    />
                  </p>
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
