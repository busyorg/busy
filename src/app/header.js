let React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./../actions'),
  Link = require('react-router').Link;

const Header = React.createClass({
  render() {
    return (
      <header>
        <Link to="/" onlyActiveOnIndex activeClassName="active" className="logo"><img src="/img/logo-blue.svg" width="34" /></Link>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible && <a href="#" onClick={() => this.props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
          <a href="#"><i className="icon icon-md icon-menu material-icons">search</i></a>
          <div className="section-content top-head"></div>
          <a><i className="icon icon-md icon-menu material-icons">notifications</i></a>
        </div>
        {this.props.children && <div className="app-nav">{this.props.children}</div>}
      </header>
    );
  }
});

const mapStateToProps = (state) => {
  return { app: state.app };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSidebar() { dispatch(actions.showSidebar()); },
    hideSidebar() { dispatch(actions.hideSidebar()); },
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Header);
