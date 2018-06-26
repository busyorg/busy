import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from './BaseWidget';
import './ListWidget.less';

export default function ListWidget({ data, renderItem, keyExtractor, ...restProps }) {
  return (
    <BaseWidget {...restProps}>
      {data.map((item, id) => (
        <div key={keyExtractor(item, id)} className="ListWidget__item">
          {renderItem(item, id)}
        </div>
      ))}
    </BaseWidget>
  );
}

ListWidget.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  renderItem: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func,
};

ListWidget.defaultProps = {
  keyExtractor: item => item.id,
};
