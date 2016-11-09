let React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./../actions'),
  Link = require('react-router').Link;

const Header = React.createClass({
  render() {
    return (
      <header>
        <div className="logo"><Link to="/" onlyActiveOnIndex activeClassName="active"><img src="/img/busy-blue.svg" /></Link></div>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible && <a onClick={() => this.props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
          {this.props.app.sidebarIsVisible && <a><i className="icon icon-md icon-menu material-icons">search</i></a>}
          <div className="section-content top-head"></div>
          <button
            className="btn-reset"
          >
            <i className="icon icon-md icon-menu material-icons">
              notifications
            </i>
          </button>
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
