import React, { Component } from 'react';

export default class Tooltip extends Component {
  onMouseOver() {
    console.log('over')
    this.setState({
      mouseover: true,
    });
  }

  onMouseLeave() {
    console.log('leave')
    this.setState({
      mouseover: false,
    });
  }


  render() {
    return (
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <div
          style={{
            position: 'absolute',
            borderRadius: 10,
            top: 0,
            zIndex: 2000,
            backgroundColor: '#3756a0',
            width: 'auto',
            color: 'white',
            padding: 13,
            left: '-120%',
            visibility: null, // this.state.over ? null : 'hidden',
          }}
        >
          {this.props.overlay}
        </div>

        <span
          onMouseOver={this.onMouseOver.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        >
          {this.props.children}
        </span>
      </span>
    );
  }
}
