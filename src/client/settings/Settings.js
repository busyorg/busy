import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Radio, Checkbox } from 'antd';
import {
  getIsReloading,
  getLocale,
  getVotingPower,
  getIsSettingsLoading,
  getVotePercent,
  getShowNSFWPosts,
} from '../reducers';
import { saveSettings } from './settingsActions';
import { reload } from '../auth/authActions';
import { notify } from '../app/Notification/notificationActions';
import Action from '../components/Button/Action';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RawSlider from '../components/Slider/RawSlider';
import requiresLogin from '../auth/requiresLogin';
import './Settings.less';

@requiresLogin
@injectIntl
@connect(
  state => ({
    reloading: getIsReloading(state),
    locale: getLocale(state),
    votingPower: getVotingPower(state),
    votePercent: getVotePercent(state),
    showNSFWPosts: getShowNSFWPosts(state),
    loading: getIsSettingsLoading(state),
  }),
  { reload, saveSettings, notify },
)
export default class Settings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reloading: PropTypes.bool,
    locale: PropTypes.string,
    votingPower: PropTypes.string,
    votePercent: PropTypes.number,
    loading: PropTypes.bool,
    showNSFWPosts: PropTypes.bool,
    reload: PropTypes.func,
    saveSettings: PropTypes.func,
    notify: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    locale: 'auto',
    votingPower: 'auto',
    votePercent: 10000,
    loading: false,
    showNSFWPosts: false,
    reload: () => {},
    saveSettings: () => {},
    notify: () => {},
  };

  state = {
    locale: 'auto',
    votingPower: 'auto',
    votePercent: 10000,
    showNSFWPosts: false,
  };

  componentWillMount() {
    this.setState({
      locale: this.props.locale,
      votingPower: this.props.votingPower,
      votePercent: this.props.votePercent / 100,
      showNSFWPosts: this.props.showNSFWPosts,
    });
  }

  componentDidMount() {
    this.props.reload();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.setState({ locale: nextProps.locale });
    }

    if (nextProps.votingPower !== this.props.votingPower) {
      this.setState({ votingPower: nextProps.votingPower });
    }

    if (nextProps.votePercent !== this.props.votePercent) {
      this.setState({ votePercent: nextProps.votePercent / 100 });
    }

    if (nextProps.showNSFWPosts !== this.props.showNSFWPosts) {
      this.setState({ showNSFWPosts: nextProps.showNSFWPosts });
    }
  }

  languages = {
    'ar-SA': 'العربية - Arabic‏',
    'as-IN': 'অসমীয়া - Assamese',
    'bg-BG': 'Български език - Bulgarian',
    'bn-IN': 'বাংলা - Bengali',
    'ca-ES': 'Català - Catalan',
    'cs-CZ': 'Čeština - Czech',
    'da-DK': 'Dansk - Danish',
    'de-DE': 'Deutsch - German',
    'el-GR': 'Ελληνικά - Greek',
    'en-US': 'English',
    'es-ES': 'Español - Spanish',
    'et-EE': 'Eesti - Estonian',
    'fil-PH': 'Filipino',
    'fr-FR': 'Français - French',
    'he-IL': 'עִבְרִית - Hebrew',
    'hi-IN': 'हिन्दी - Hindi',
    'hr-HR': 'Hrvatski - Croatian',
    'hu-HU': 'Magyar - Hungarian',
    'id-ID': 'Bahasa Indonesia - Indonesian',
    'it-IT': 'Italiano - Italian',
    'ja-JP': '日本語 - Japanese',
    'ko-KR': '한국어 - Korean',
    'lo-LA': 'ພາສາລາວ - Lao',
    'ms-MY': 'Bahasa Melayu - Malay',
    'ne-NP': 'Nederlands - Dutch',
    'nl-NL': 'Norsk - Norwegian',
    'no-NO': 'नेपाली - Nepali',
    'pl-PL': 'Polski - Polish',
    'pt-BR': 'Português - Portuguese',
    'ro-RO': 'Română - Romanian',
    'ru-RU': 'Русский - Russian',
    'sl-SI': 'Slovenščina - Slovenian',
    'sv-SE': 'Svenska - Swedish',
    'ta-IN': 'தமிழ் - Tamil',
    'th-TH': 'ภาษาไทย - Thai',
    'tr-TR': 'Türkçe - Turkish',
    'uk-UA': 'Українська мова - Ukrainian',
    'vi-VN': 'Tiếng Việt - Vietnamese',
    'yo-NG': 'Yorùbá - Yoruba',
    'zh-CN': '简体中文 - Simplified Chinese',
    // zh: '繁體中文 - Traditional Chinese',
  };

  handleSave = () => {
    this.props
      .saveSettings({
        locale: this.state.locale,
        votingPower: this.state.votingPower,
        votePercent: this.state.votePercent * 100,
        showNSFWPosts: this.state.showNSFWPosts,
      })
      .then(() =>
        this.props.notify(
          this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }),
          'success',
        ),
      );
  };

  handleLocaleChange = locale => this.setState({ locale });
  handleVotingPowerChange = event => this.setState({ votingPower: event.target.value });
  handleVotePercentChange = value => this.setState({ votePercent: value });
  handleShowNSFWPosts = event => this.setState({ showNSFWPosts: event.target.checked });

  render() {
    const {
      intl,
      reloading,
      locale: initialLocale,
      votingPower: initialVotingPower,
      showNSFWPosts: initialShowNSFWPosts,
      loading,
    } = this.props;
    const { votingPower, locale, showNSFWPosts } = this.state;

    const languageOptions = [];

    if (locale === 'auto') {
      languageOptions.push(
        <Select.Option disabled key="auto" value="auto">
          <FormattedMessage id="select_language" defaultMessage="Select your language" />
        </Select.Option>,
      );
    }

    Object.keys(this.languages).forEach(key => {
      languageOptions.push(
        <Select.Option key={key} value={key}>
          {this.languages[key]}
        </Select.Option>,
      );
    });

    return (
      <div className="shifted">
        <Helmet>
          <title>{intl.formatMessage({ id: 'settings', defaultMessage: 'Settings' })} - Busy</title>
        </Helmet>
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
              <div className="Settings">
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="voting_power" defaultMessage="Voting Power" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="voting_power_info"
                      defaultMessage="You can enable Voting Power slider to specify exact percentage of your Voting Power to use for like."
                    />
                  </p>
                  <Radio.Group
                    defaultValue={initialVotingPower}
                    value={votingPower}
                    onChange={this.handleVotingPowerChange}
                  >
                    <Radio value="off">
                      <FormattedMessage id="voting_power_off" defaultMessage="Disable slider" />
                    </Radio>
                    <Radio value="on">
                      <FormattedMessage id="voting_power_on" defaultMessage="Enable slider" />
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="vote_percent" defaultMessage="Default vote percent" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="vote_percent_info"
                      defaultMessage="You can select your default vote value. It will be used as default value in voting slider and as value used for vote when voting slider is disabled."
                    />
                  </p>
                  <div className="Settings__section__component">
                    <RawSlider
                      initialValue={this.state.votePercent}
                      onChange={this.handleVotePercentChange}
                    />
                  </div>
                </div>
                <div className="Settings__section">
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
                    defaultValue={initialLocale}
                    value={locale}
                    style={{ width: '100%', maxWidth: 240 }}
                    onChange={this.handleLocaleChange}
                  >
                    {languageOptions}
                  </Select>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="nsfw_posts" defaultMessage="NSFW Posts" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="display_nsfw_posts_details"
                      defaultMessage="You can enable all posts tagged with NSFW to be shown as default."
                    />
                  </p>
                  <div className="Settings__section__nsfw">
                    <Checkbox
                      name="nsfw_posts"
                      defaultChecked={initialShowNSFWPosts}
                      checked={showNSFWPosts}
                      onChange={this.handleShowNSFWPosts}
                    >
                      <FormattedMessage
                        id="display_nsfw_posts"
                        defaultMessage="Display NSFW Posts"
                      />
                    </Checkbox>
                  </div>
                </div>
                <Action
                  primary
                  loading={loading}
                  text={this.props.intl.formatMessage({ id: 'save', defaultMessage: 'Save' })}
                  onClick={this.handleSave}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
