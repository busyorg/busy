import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import { SUPPORTED_LANGUAGES } from '../../../common/constants/settings';
import { saveSettings, setLocale } from '../../settings/settingsActions';
import { getIsAuthenticated, getLocale } from '../../reducers';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './LanguageSettings.less';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    locale: getLocale(state),
  }),
  {
    saveSettings,
    setLocale: locale => dispatch => dispatch(setLocale(locale)),
  },
)
class LanguageSettings extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    saveSettings: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    locale: PropTypes.string,
  };

  static defaultProps = {
    locale: 'en-US',
  };

  constructor(props) {
    super(props);
    let localeStorageLanguage = 'en-US';

    if (localStorage) localeStorageLanguage = localStorage.language;

    const selectedLanguage = props.authenticated ? props.locale : localeStorageLanguage;

    this.state = {
      languageSettingsVisible: false,
      selectedLanguage,
    };

    this.handleLanguageSettingsVisibleChange = this.handleLanguageSettingsVisibleChange.bind(this);
    this.handleLanguageSettingsSelect = this.handleLanguageSettingsSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const diffLocale = this.props.locale !== nextProps.locale;
    if (diffLocale) this.setState({ selectedLanguage: nextProps.locale });
  }

  handleLanguageSettingsVisibleChange(visible) {
    this.setState({ languageSettingsVisible: visible });
  }

  handleLanguageSettingsSelect(selectedLanguage) {
    const { authenticated } = this.props;
    if (authenticated) {
      this.props.saveSettings({ locale: selectedLanguage }).then(() => {
        this.setState({
          selectedLanguage,
          languageSettingsVisible: false,
        });
      });
    } else {
      if (localStorage) localStorage.setItem('language', selectedLanguage);
      this.props.setLocale(selectedLanguage);
      this.setState({
        selectedLanguage,
        languageSettingsVisible: false,
      });
    }
  }

  render() {
    const { languageSettingsVisible, selectedLanguage } = this.state;
    const displaySelectedLanguage = _.get(
      SUPPORTED_LANGUAGES,
      `${selectedLanguage}.shortName`,
      'English',
    );
    return (
      <Popover
        placement="bottom"
        trigger="click"
        visible={languageSettingsVisible}
        onVisibleChange={this.handleLanguageSettingsVisibleChange}
        overlayStyle={{ position: 'fixed' }}
        overlayClassName="LanguageSettings"
        content={
          <PopoverMenu onSelect={this.handleLanguageSettingsSelect}>
            {_.map(SUPPORTED_LANGUAGES, (languageDetails, language) => (
              <PopoverMenuItem key={language}>
                <span>{languageDetails.longName}</span>
              </PopoverMenuItem>
            ))}
          </PopoverMenu>
        }
      >
        <a className="Topnav__link Topnav__link--light">{displaySelectedLanguage}</a>
      </Popover>
    );
  }
}

export default LanguageSettings;
