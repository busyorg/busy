import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Select } from 'antd';
import { getLocale, getIsLocaleLoading } from '../reducers';
import { setLocale } from './appActions';

@connect(
  state => ({
    locale: getLocale(state),
    localeLoading: getIsLocaleLoading(state),
  }),
  { setLocale },
)
export default class AppSettings extends React.Component {
  static propTypes = {
    setLocale: PropTypes.func,
    localeLoading: PropTypes.bool,
  };

  static defaultProps = {
    setLocale: () => {},
    localeLoading: false,
  };

  handleLocaleChange = locale => this.props.setLocale(locale);

  render() {
    const { localeLoading } = this.props;
    return (
      <div className="shifted">
        <div className="container">
          <h1>
            <FormattedMessage id="settings" defaultMessage="Settings" />
          </h1>
          <h2>
            <FormattedMessage id="language" defaultMessage="Language" />
          </h2>
          <div>
            <Select disabled={localeLoading} defaultValue="en" style={{ width: '100%', maxWidth: 240 }} onChange={this.handleLocaleChange}>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="zh">简体中文</Select.Option>
              <Select.Option value="cs">Čeština</Select.Option>
              <Select.Option value="es">Español</Select.Option>
              <Select.Option value="fr">Français</Select.Option>
              <Select.Option value="pl">Polski</Select.Option>
              <Select.Option value="de">Deutsch</Select.Option>
              <Select.Option value="ru">Русский</Select.Option>
              <Select.Option value="ko">한국어</Select.Option>
              <Select.Option value="nl">Nederlands</Select.Option>
              <Select.Option value="sv">Svenska</Select.Option>
            </Select>
          </div>
        </div>
      </div>
    );
  }
}
