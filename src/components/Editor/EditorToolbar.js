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
      <Menu.Item key="h1">Heading 1</Menu.Item>
      <Menu.Item key="h2">Heading 2</Menu.Item>
      <Menu.Item key="h3">Heading 3</Menu.Item>
      <Menu.Item key="h4">Heading 4</Menu.Item>
      <Menu.Item key="h5">Heading 5</Menu.Item>
      <Menu.Item key="h6">Heading 6</Menu.Item>
    </Menu>
  );

  return (
    <div className="EditorToolbar">
      <Dropdown overlay={menu}>
        <Button>
          Heading <Icon type="down" />
        </Button>
      </Dropdown>
      <Tooltip title={tooltip('Add bold', 'Ctrl+b')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('b')}>
          b
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add italic', 'Ctrl+i')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('i')}>
          i
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add quote', 'Ctrl+q')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('q')}>
          q
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add link', 'Ctrl+k')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('link')}>
          Link
        </Button>
      </Tooltip>
      <Tooltip title={tooltip('Add image', 'Ctrl+m')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('image')}>
          Image
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
