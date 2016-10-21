let React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./../actions'),
  MenuFeed = require('./Menu/MenuFeed'),
  MenuUser = require('./Menu/MenuUser'),
  MenuAbout = require('./Menu/MenuAbout'),
  MenuSteem = require('./Menu/MenuSteem'),
  Link = require('react-router').Link;

const Header = React.createClass({
  render() {
    const menu = this.props.menu || this.props.header.menu;
    const username = this.props.account || this.props.auth.user.name;
    const category = (this.props.category) ? `/${this.props.category}` : '';
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible && <a href="#" onClick={() => this.props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
          {this.props.app.sidebarIsVisible && <a href="#" onClick={() => this.props.hideSidebar()}><i className="icon icon-md icon-menu material-icons">keyboard_backspace</i></a>}
          <div className="section-content top-head">
            <Link to="/" onlyActiveOnIndex activeClassName="active"><img src="/img/logo-blue.svg" /></Link>
          </div>
          <a><i className="icon icon-md icon-menu material-icons">notifications</i></a>
        </div>
        {menu === 'primary' && <MenuFeed category={category} />}
        {menu === 'secondary' && <MenuUser username={username} />}
        {menu === 'about' && <MenuAbout />}
        {menu === 'steem' && <MenuSteem />}
        {this.props.children && <div className="app-nav">{this.props.children}</div>}
      </header>
    );
  }
});

const mapStateToProps = function (state) {
  return {
    app: state.app,
    auth: state.auth,
    header: state.header
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    showSidebar() { dispatch(actions.showSidebar()); },
    hideSidebar() { dispatch(actions.hideSidebar()); },
    setMenu(menu) { dispatch(actions.setMenu(menu)); }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Header);
