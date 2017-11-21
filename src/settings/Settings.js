import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
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
import './Settings.less';

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
    showNSFWPosts: null,
  };

  componentWillMount() {
    this.setState({
      locale: this.props.locale,
      votingPower: this.props.votingPower,
      votePercent: this.props.votePercent / 100,
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
      this.setState({ votingPower: nextProps.votingPower / 100 });
    }

    if (nextProps.votePercent !== this.props.votePercent) {
      this.setState({ votePercent: nextProps.votePercent / 100 });
    }

    if (nextProps.showNSFWPosts !== this.props.showNSFWPosts) {
      this.setState({ showNSFWPosts: nextProps.showNSFWPosts });
    }
  }

  languages = {
    en: 'English',
    id: 'Bahasa Indonesia - Indonesian',
    ms: 'Bahasa Melayu - Malay',
    ca: 'Català - Catalan',
    cs: 'Čeština - Czech',
    da: 'Dansk - Danish',
    de: 'Deutsch - German',
    et: 'Eesti - Estonian',
    es: 'Español - Spanish',
    fil: 'Filipino',
    fr: 'Français - French',
    hr: 'Hrvatski - Croatian',
    it: 'Italiano - Italian',
    hu: 'Magyar - Hungarian',
    nl: 'Nederlands - Dutch',
    no: 'Norsk - Norwegian',
    pl: 'Polski - Polish',
    pt: 'Português - Portuguese',
    ro: 'Română - Romanian',
    sl: 'Slovenščina - Slovenian',
    sv: 'Svenska - Swedish',
    vi: 'Tiếng Việt - Vietnamese',
    tr: 'Türkçe - Turkish',
    yo: 'Yorùbá - Yoruba',
    el: 'Ελληνικά - Greek',
    bg: 'Български език - Bulgarian',
    ru: 'Русский - Russian',
    uk: 'Українська мова - Ukrainian',
    he: 'עִבְרִית - Hebrew',
    ar: 'العربية - Arabic‏',
    np: 'नेपाली - Nepali',
    hi: 'हिन्दी - Hindi',
    as: 'অসমীয়া - Assamese',
    bn: 'বাংলা - Bengali',
    ta: 'தமிழ் - Tamil',
    lo: 'ພາສາລາວ - Lao',
    th: 'ภาษาไทย - Thai',
    ko: '한국어 - Korean',
    ja: '日本語 - Japanese',
    zh: '简体中文 - Simplified Chinese',
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
                      checked={_.isBoolean(showNSFWPosts) ? showNSFWPosts : initialShowNSFWPosts}
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
              </div>)}
          </div>
        </div>
      </div>
    );
  }
}
