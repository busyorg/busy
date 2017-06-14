import React, { PropTypes } from 'react';
import { Button } from 'antd';
import './EditorToolbar.less';

const EditorToolbar = ({ onSelect }) =>
  <div className="EditorToolbar">
    <Button className="EditorToolbar__button" onClick={() => onSelect('h1')}>h1</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('h2')}>h2</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('h3')}>h3</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('h4')}>h4</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('h5')}>h5</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('h6')}>h6</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('b')}>B</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('i')}>I</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('q')}>"</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('link')}>Link</Button>
    <Button className="EditorToolbar__button" onClick={() => onSelect('image')}>Image</Button>
  </div>;

EditorToolbar.propTypes = {
  onSelect: PropTypes.func,
};

EditorToolbar.defaultProps = {
  onSelect: () => {},
};

export default EditorToolbar;
