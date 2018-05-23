import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Cookie from 'js-cookie';
import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import { saveSettings, setLocale } from '../../settings/settingsActions';
import { getUsedLocale } from '../../reducers';
import Popover from '../Popover';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './LanguageSettings.less';

@connect(
  state => ({
    usedLocale: getUsedLocale(state),
  }),
  {
    saveSettings,
    setLocale,
  },
)
class LanguageSettings extends React.Component {
  static propTypes = {
    usedLocale: PropTypes.string,
    setLocale: PropTypes.func,
  };

  static defaultProps = {
    usedLocale: 'en-US',
    setLocale: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      languageSettingsVisible: false,
      selectedLoadingLanguage: '',
    };

    this.handleLanguageSettingsVisibleChange = this.handleLanguageSettingsVisibleChange.bind(this);
    this.handleLanguageSettingsSelect = this.handleLanguageSettingsSelect.bind(this);
  }

  handleLanguageSettingsVisibleChange(visible) {
    this.setState({ languageSettingsVisible: visible });
  }

  handleLanguageSettingsSelect(selectedLanguage) {
    Cookie.set('language', selectedLanguage);
    this.setState({
      languageSettingsVisible: false,
    });
    this.props.setLocale(selectedLanguage);
  }

  render() {
    const { usedLocale } = this.props;
    const { languageSettingsVisible } = this.state;

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
            {LANGUAGES.map(lang => (
              <PopoverMenuItem key={lang.id}>
                <span
                  className={classNames('LanguageSettings__option', {
                    'LanguageSettings__option-selected': usedLocale === lang.id,
                  })}
                >
                  {getLanguageText(lang)}
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
