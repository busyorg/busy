import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Menu, Dropdown, Icon } from 'antd';
import './EditorToolbar.less';

const tooltip = (description, shortcut) =>
  (<span>
    {description}
    <br />
    <b>
      {shortcut}
    </b>
  </span>);

const EditorToolbar = ({ onSelect }) => {
  const menu = (
    <Menu onClick={e => onSelect(e.key)}>
      <Menu.Item key="h1"><h1>Heading 1</h1></Menu.Item>
      <Menu.Item key="h2"><h2>Heading 2</h2></Menu.Item>
      <Menu.Item key="h3"><h3>Heading 3</h3></Menu.Item>
      <Menu.Item key="h4"><h4>Heading 4</h4></Menu.Item>
      <Menu.Item key="h5"><h5>Heading 5</h5></Menu.Item>
      <Menu.Item key="h6"><h6>Heading 6</h6></Menu.Item>
    </Menu>
  );

  return (
    <div className="EditorToolbar">
      <Dropdown overlay={menu}>
        <Button className="EditorToolbar__button">
          <i className="iconfont icon-fontsize" /> <Icon type="down" />
        </Button>
      </Dropdown>
      <Tooltip title={tooltip('Add bold', 'Ctrl+b')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('b')}>
          <i className="iconfont icon-bold" />
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add italic', 'Ctrl+i')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('i')}>
          <i className="iconfont icon-italic" />
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add quote', 'Ctrl+q')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('q')}>
          <i className="iconfont icon-q1" />
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add link', 'Ctrl+k')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('link')}>
          <i className="iconfont icon-link" />
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add image', 'Ctrl+m')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('image')}>
          <i className="iconfont icon-picture" />
        </Button>
      </Tooltip>
    </div>
  );
};

EditorToolbar.propTypes = {
  onSelect: PropTypes.func,
};

EditorToolbar.defaultProps = {
  onSelect: () => {},
};

export default EditorToolbar;
