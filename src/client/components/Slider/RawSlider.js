import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Slider } from 'antd';
import './RawSlider.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class RawSlider extends React.Component {
  static propTypes = {
    initialValue: PropTypes.number,
    tipFormatter: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    initialValue: 100,
    tipFormatter: value => `${value}%`,
    onChange: () => {},
  };

  state = {
    value: 100,
  };

  componentWillMount() {
    this.setState({ value: this.props.initialValue });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({
        value: nextProps.initialValue,
      });
    }
  }

  marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  handlePresetChange = event => {
    this.setState({ value: event.target.value }, () => {
      this.props.onChange(event.target.value);
    });
  };

  handleChange = value => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };

  render() {
    const { value } = this.state;

    return (
      <div className="RawSlider">
        <Slider
          value={value}
          marks={this.marks}
          tipFormatter={this.props.tipFormatter}
          onChange={this.handleChange}
        />
        <div className="RawSlider__presets">
          <RadioGroup value={value} size="large" onChange={this.handlePresetChange}>
            <RadioButton value={1}>1%</RadioButton>
            <RadioButton value={25}>25%</RadioButton>
            <RadioButton value={50}>50%</RadioButton>
            <RadioButton value={75}>75%</RadioButton>
            <RadioButton value={100}>100%</RadioButton>
          </RadioGroup>
        </div>
      </div>
    );
  }
}

export default RawSlider;
