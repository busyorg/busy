var React = require('react');

module.exports = React.createClass({
  render() {
    let className = (this.props.color === 'white') ? 'loading-white' : 'loading';
    className += ' align-center';
    return (
      <div><div className={className}>
        <span>●</span><span>●</span><span>●</span></div>
      </div>
    );
  }
});
