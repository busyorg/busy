import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import USDDisplay from '../Utils/USDDisplay';
import RawSlider from './RawSlider';
import './Slider.less';

@injectIntl
export default class Slider extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    value: PropTypes.number,
    voteWorth: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: 100,
    voteWorth: 0,
    onChange: () => {},
  };

  state = {
    value: 100,
  };

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  componentDidMount() {
    this.props.onChange(this.state.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  getCurrentValue = () => this.props.voteWorth;

  getCurrentFormattedValue = () =>
    this.props.intl.formatNumber(this.getCurrentValue(), {
      style: 'currency',
      currency: 'USD',
    });

  handleChange = value => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };

  formatTip = value => (
    <div>
      <FormattedNumber
        style="percent" // eslint-disable-line react/style-prop-object
        value={value / 100}
      />
      <span style={{ opacity: '0.5' }}>
        {' '}
        <USDDisplay value={this.getCurrentValue()} />
      </span>
    </div>
  );

  render() {
    const { value } = this.state;

    return (
      <div className="Slider">
        <RawSlider
          initialValue={value}
          onChange={this.handleChange}
          tipFormatter={this.formatTip}
        />
        <div className="Slider__info">
          <h3>
            <FormattedMessage
              id="like_slider_info"
              defaultMessage="Your vote will be worth {amount}."
              values={{
                amount: (
                  <span className="Slider__info__amount">{this.getCurrentFormattedValue()}</span>
                ),
              }}
            />
          </h3>
        </div>
      </div>
    );
  }
}
