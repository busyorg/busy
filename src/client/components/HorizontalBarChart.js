import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './HorizontalBarChart.less';

const HorizontalBarChart = ({ current, total }) => {
  const barChartElements = [];

  for (let i = 1; i <= total; i += 1) {
    barChartElements.push(
      <div
        key={i}
        className={classNames('HorizontalBarChart__bar', {
          HorizontalBarChart__bar__selected: i <= current,
        })}
        style={{ width: `${1 / total * 100}%` }}
      />,
    );
  }

  return <div className="HorizontalBarChart">{barChartElements}</div>;
};

HorizontalBarChart.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default HorizontalBarChart;
