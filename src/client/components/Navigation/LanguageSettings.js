import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { availableLocalesToReactIntl } from '../../translations/index';
import { SUPPORTED_LANGUAGES } from '../../../common/constants/settings';
import { saveSettings, setLocale } from '../../settings/settingsActions';
import { getIsAuthenticated, getLocale } from '../../reducers';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import Loading from '../Icon/Loading';
import './LanguageSettings.less';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    locale: getLocale(state),
  }),
  {
    saveSettings,
    setLocale,
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

  static getValidLocale = locale => {
    const availableLocales = _.keys(availableLocalesToReactIntl);
    const defaultLocale = 'en-US';

    for (let i = 0; i < availableLocales.length; i += 1) {
      const currentLocale = availableLocales[i];
      const currentLocaleShortValue = availableLocalesToReactIntl[currentLocale];

      if (locale === currentLocale) {
        return currentLocale;
      } else if (locale === currentLocaleShortValue) {
        return currentLocale;
      }
    }

    return defaultLocale;
  };

  constructor(props) {
    super(props);

    let localeStorageLanguage;
    let browserLanguage;

    if (localStorage) localeStorageLanguage = localStorage.language;
    if (navigator) {
      browserLanguage = LanguageSettings.getValidLocale(
        _.get(navigator.languages, 0, navigator.language),
      );
    }

    const localLanguage = localeStorageLanguage || browserLanguage;
    const selectedLanguage = props.authenticated ? props.locale : localLanguage;

    this.state = {
      languageSettingsVisible: false,
      selectedLanguage,
      loading: false,
      selectedLoadingLanguage: '',
    };

    this.handleLanguageSettingsVisibleChange = this.handleLanguageSettingsVisibleChange.bind(this);
    this.handleLanguageSettingsSelect = this.handleLanguageSettingsSelect.bind(this);
  }

  componentDidMount() {
    this.props.setLocale(this.state.selectedLanguage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.locale !== nextProps.locale) {
      this.setState({ selectedLanguage: LanguageSettings.getValidLocale(nextProps.locale) });
    }
  }

  setLoadingLanguage(loading, selectedLoadingLanguage) {
    this.setState({ loading, selectedLoadingLanguage });
  }

  handleLanguageSettingsVisibleChange(visible) {
    this.setState({ languageSettingsVisible: visible });
  }

  handleLanguageSettingsSelect(selectedLanguage) {
    const { authenticated } = this.props;
    const { loading } = this.state;

    if (loading) return;

    if (authenticated) {
      this.setLoadingLanguage(true, selectedLanguage);
      this.props.saveSettings({ locale: selectedLanguage }).then(() => {
        this.setState({
          selectedLanguage,
          languageSettingsVisible: false,
          loading: false,
          selectedLoadingLanguage: '',
        });
      });
    } else {
      if (localStorage) localStorage.setItem('language', selectedLanguage);
      this.props.setLocale(selectedLanguage);
      this.setState({
        selectedLanguage,
        languageSettingsVisible: false,
        loading: false,
        selectedLoadingLanguage: '',
      });
    }
  }

  render() {
    const {
      languageSettingsVisible,
      selectedLanguage,
      selectedLoadingLanguage,
      loading,
    } = this.state;
    const loaderStyle = {
      display: 'flex',
      marginTop: '-5px',
    };

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
                <span
                  className={classNames('LanguageSettings__option', {
                    'LanguageSettings__option-selected': selectedLanguage === language,
                  })}
                >
                  {language === selectedLoadingLanguage &&
                    loading && <Loading style={loaderStyle} />}
                  {` ${languageDetails.longName}`}
                </span>
              </PopoverMenuItem>
            ))}
          </PopoverMenu>
        }
      >
        <a className="Topnav__link Topnav__link--light">
          <i className="iconfont icon-language" />
        </a>
      </Popover>
    );
  }
}

export default LanguageSettings;
