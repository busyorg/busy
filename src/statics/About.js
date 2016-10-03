let React = require('react'),
  Header = require('./../app/header');

module.exports = React.createClass({
  render() {
    return (
      <div className="main-panel">
        <Header menu="about" />
        <div className="page">
          <div className="block" style={{ paddingBottom: '400px' }}>
            <div className="container">
              <h1>About</h1>
              <h2>The Busy Foundation’s mission is to develop and promote the next generation decentralized social network, and together build a more globally accessible, more free and more trustworthy Internet.</h2>
            </div>
          </div>
          <div className="block dark about-1"><h1>Including billions of people in the global economy</h1></div>
          <div className="block dark about-2"><h1>Protecting rights through immutable records</h1></div>
          <div className="block dark about-3"><h1>Creating a true sharing economy</h1></div>
          <div className="block dark about-4"><h1>Ending the remittance ripoff</h1></div>
          <div className="block dark about-5"><h1>Protect privacy</h1></div>
          <div className="block dark about-6"><h1>Ensuring compensation for the creators of value</h1></div>
        </div>
      </div>
    );
  }
});
