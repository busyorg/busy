import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Popover } from 'antd';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './SortSelector.less';

export default class SortSelector extends React.Component {
  static Item = PopoverMenuItem;

  static propTypes = {
    sort: PropTypes.string,
    children: PropTypes.node,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    sort: null,
    children: null,
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleVisibleChange() {
    this.setState(prevState => ({ visible: !prevState.visible }));
  }

  handleSelect(current) {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.props.onChange(current);
      },
    );
  }

  render() {
    const { sort } = this.props;
    const { visible } = this.state;

    const currentSort = React.Children.map(this.props.children, c => c).find(
      c => c.key === `.$${sort}`,
    );

    return (
      <div className="SortSelector">
        <span className="SortSelector__title">
          <FormattedMessage id="sort_by" defaultMessage="Sort by" />
        </span>
        <Popover
          trigger="click"
          placement="bottom"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          content={
            <PopoverMenu bold onSelect={this.handleSelect}>
              {this.props.children}
            </PopoverMenu>
          }
        >
          <span className="SortSelector__current">
            {currentSort && currentSort.props && currentSort.props.children}
            <i className="iconfont icon-unfold" />
          </span>
        </Popover>
      </div>
    );
  }
}
