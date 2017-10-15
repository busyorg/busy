import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Radio, Slider as AntSlider } from 'antd';
import Action from '../Button/Action';
import './Slider.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
export default class Slider extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
  };

  state = {
    value: 50,
  };

  getCurrentValue = () => this.state.value * this.percentValue;

  getCurrentFormattedValue = () =>
    this.props.intl.formatNumber(this.state.value * this.percentValue, {
      style: 'currency',
      currency: 'USD',
    });

  percentValue = 0.4424;

  marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  handlePresetChange = event => this.setState({ value: event.target.value });

  handleChange = value => this.setState({ value });

  formatTip = value => `${value}% - ${this.getCurrentFormattedValue()}`;

  render() {
    return (
      <div className="Slider">
        <AntSlider
          value={this.state.value}
          marks={this.marks}
          tipFormatter={this.formatTip}
          onChange={this.handleChange}
        />
        <div className="Slider__presets">
          <RadioGroup value={this.state.value} size="large" onChange={this.handlePresetChange}>
            <RadioButton value={1}>1%</RadioButton>
            <RadioButton value={25}>25%</RadioButton>
            <RadioButton value={50}>50%</RadioButton>
            <RadioButton value={75}>75%</RadioButton>
            <RadioButton value={100}>100%</RadioButton>
          </RadioGroup>
        </div>
        <Action primary text={`Like (${this.getCurrentFormattedValue()})`} />
      </div>
    );
  }
}
