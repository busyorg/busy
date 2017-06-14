import React, { PropTypes } from 'react';
import { Button, Tooltip } from 'antd';
import './EditorToolbar.less';

const tooltip = (description, shortcut) =>
  <span>{description}<br /><b>{shortcut}</b></span>;

const EditorToolbar = ({ onSelect }) =>
  <div className="EditorToolbar">
    <Tooltip title={tooltip('Add heading 1', 'Ctrl+Shift+1')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('h1')}>h1</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add heading 2', 'Ctrl+Shift+2')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('h2')}>h2</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add heading 3', 'Ctrl+Shift+3')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('h3')}>h3</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add heading 4', 'Ctrl+Shift+4')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('h4')}>h4</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add heading 5', 'Ctrl+Shift+5')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('h5')}>h5</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add heading 6', 'Ctrl+Shift+6')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('h6')}>h6</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add bold', 'Ctrl+b')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('b')}>b</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add italic', 'Ctrl+i')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('i')}>i</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add quote', 'Ctrl+q')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('q')}>q</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add link', 'Ctrl+k')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('link')}>Link</Button>
    </Tooltip>
    <Tooltip title={tooltip('Add image', 'Ctrl+m')}>
      <Button className="EditorToolbar__button" onClick={() => onSelect('image')}>Image</Button>
    </Tooltip>
  </div>;

EditorToolbar.propTypes = {
  onSelect: PropTypes.func,
};

EditorToolbar.defaultProps = {
  onSelect: () => {},
};

export default EditorToolbar;
