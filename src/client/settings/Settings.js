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
  getRewriteLinks,
  getUseBeta,
  getUpvoteSetting,
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
    rewriteLinks: getRewriteLinks(state),
    useBeta: getUseBeta(state),
    loading: getIsSettingsLoading(state),
    upvoteSetting: getUpvoteSetting(state),
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
    rewriteLinks: PropTypes.bool,
    useBeta: PropTypes.bool,
    reload: PropTypes.func,
    saveSettings: PropTypes.func,
    notify: PropTypes.func,
    upvoteSetting: PropTypes.bool,
  };

  static defaultProps = {
    reloading: false,
    locale: 'auto',
    votingPower: 'auto',
    votePercent: 10000,
    loading: false,
    showNSFWPosts: false,
    rewriteLinks: false,
    useBeta: false,
    upvoteSetting: true,
    reload: () => {},
    saveSettings: () => {},
    notify: () => {},
  };

  constructor(props) {
    super(props);
    this.handleUpvoteSettingChange = this.handleUpvoteSettingChange.bind(this);
  }

  state = {
    locale: 'auto',
    votingPower: 'auto',
    votePercent: 10000,
    showNSFWPosts: false,
    rewriteLinks: false,
  };

  componentWillMount() {
    this.setState({
      locale: this.props.locale,
      votingPower: this.props.votingPower,
      votePercent: this.props.votePercent / 100,
      showNSFWPosts: this.props.showNSFWPosts,
      rewriteLinks: this.props.rewriteLinks,
      useBeta: this.props.useBeta,
      upvoteSetting: this.props.upvoteSetting,
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

    if (nextProps.rewriteLinks !== this.props.rewriteLinks) {
      this.setState({ rewriteLinks: nextProps.rewriteLinks });
    }

    if (nextProps.useBeta !== this.props.useBeta) {
      this.setState({ useBeta: nextProps.useBeta });
    }

    if (nextProps.upvoteSetting !== this.props.upvoteSetting) {
      this.setState({ upvoteSetting: nextProps.upvoteSetting });
    }
  }

  languages = {
    'en-US': 'English',
    'id-ID': 'Bahasa Indonesia - Indonesian',
    'ms-MY': 'Bahasa Melayu - Malay',
    'ca-ES': 'Català - Catalan',
    'cs-CZ': 'Čeština - Czech',
    'da-DK': 'Dansk - Danish',
    'de-DE': 'Deutsch - German',
    'et-EE': 'Eesti - Estonian',
    'es-ES': 'Español - Spanish',
    'fil-PH': 'Filipino',
    'fr-FR': 'Français - French',
    'hr-HR': 'Hrvatski - Croatian',
    'it-IT': 'Italiano - Italian',
    'hu-HU': 'Magyar - Hungarian',
    'nl-NL': 'Nederlands - Dutch',
    'no-NO': 'Norsk - Norwegian',
    'pl-PL': 'Polski - Polish',
    'pt-BR': 'Português - Portuguese',
    'ro-RO': 'Română - Romanian',
    'sl-SI': 'Slovenščina - Slovenian',
    'sv-SE': 'Svenska - Swedish',
    'vi-VN': 'Tiếng Việt - Vietnamese',
    'tr-TR': 'Türkçe - Turkish',
    'yo-NG': 'Yorùbá - Yoruba',
    'el-GR': 'Ελληνικά - Greek',
    'bg-BG': 'Български език - Bulgarian',
    'ru-RU': 'Русский - Russian',
    'uk-UA': 'Українська мова - Ukrainian',
    'he-IL': 'עִבְרִית - Hebrew',
    'ar-SA': 'العربية - Arabic‏',
    'ne-NP': 'नेपाली - Nepali',
    'hi-IN': 'हिन्दी - Hindi',
    'as-IN': 'অসমীয়া - Assamese',
    'bn-IN': 'বাংলা - Bengali',
    'ta-IN': 'தமிழ் - Tamil',
    'lo-LA': 'ພາສາລາວ - Lao',
    'th-TH': 'ภาษาไทย - Thai',
    'ko-KR': '한국어 - Korean',
    'ja-JP': '日本語 - Japanese',
    'zh-CN': '简体中文 - Simplified Chinese',
    'zh-TW': '繁體中文 - Traditional Chinese',
  };

  handleSave = () => {
    this.props
      .saveSettings({
        locale: this.state.locale,
        votingPower: this.state.votingPower,
        votePercent: this.state.votePercent * 100,
        showNSFWPosts: this.state.showNSFWPosts,
        rewriteLinks: this.state.rewriteLinks,
        useBeta: this.state.useBeta,
        upvoteSetting: this.state.upvoteSetting,
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
  handleRewriteLinksChange = event => this.setState({ rewriteLinks: event.target.checked });
  handleUseBetaChange = event => this.setState({ useBeta: event.target.checked });

  handleUpvoteSettingChange(event) {
    this.setState({ upvoteSetting: event.target.checked });
  }

  render() {
    const {
      intl,
      reloading,
      locale: initialLocale,
      votingPower: initialVotingPower,
      showNSFWPosts: initialShowNSFWPosts,
      loading,
    } = this.props;
    const { votingPower, locale, showNSFWPosts, rewriteLinks, useBeta, upvoteSetting } = this.state;

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
                  <div className="Settings__section__checkbox">
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
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="rewrite_links" defaultMessage="Rewrite links" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="rewrite_links_details"
                      defaultMessage="You can enable this option to replace Steemit.com links with Busy.org links."
                    />
                  </p>
                  <div className="Settings__section__checkbox">
                    <Checkbox
                      name="rewrite_links"
                      checked={rewriteLinks}
                      onChange={this.handleRewriteLinksChange}
                    >
                      <FormattedMessage id="rewrite_links" defaultMessage="Rewrite links" />
                    </Checkbox>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="use_beta" defaultMessage="Use Busy beta" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="use_beta_details"
                      defaultMessage="You can enable this option to use Busy beta by default."
                    />
                  </p>
                  <div className="Settings__section__checkbox">
                    <Checkbox name="use_beta" checked={useBeta} onChange={this.handleUseBetaChange}>
                      <FormattedMessage id="use_beta" defaultMessage="Use Busy beta" />
                    </Checkbox>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="upvote_setting" defaultMessage="Like my posts" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="upvote_setting_details"
                      defaultMessage="Enable this option to automatically like your own posts."
                    />
                  </p>
                  <div className="Settings__section__checkbox">
                    <Checkbox
                      name="upvote_setting"
                      checked={upvoteSetting}
                      onChange={this.handleUpvoteSettingChange}
                    >
                      <FormattedMessage id="upvote_setting" defaultMessage="Like my posts" />
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
