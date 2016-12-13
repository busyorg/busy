import React, { Component } from 'react';
import { EditorBlock } from 'draft-js';

export default class ImageBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  onClick = () => {
    this.setState({
      selected: !this.state.selected,
    });
  };

  render() {
    const data = this.props.block.getData();
    const src = data.get('src');
    const id = data.get('id');

    return (
      <div>
        <img
          role="presentation"
          id={id}
          style={
            this.state && this.state.selected ? {
              outline: 'solid 3px #3756a0',
            } : {
            }
          }
          onClick={this.onClick}
          src={src}
        />

        <figcaption>
          <EditorBlock {...this.props} />
        </figcaption>
      </div>
    );
  }
}
