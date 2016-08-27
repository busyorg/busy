var React = require('react'),
	ReactRedux = require('react-redux'),
	actions = require('../actions'),
	Link = require('react-router').Link;

var Header = React.createClass({
	render: function(){
		var menu = this.props.menu || this.props.header.menu;
		var account = this.props.account || this.props.auth.user.name;
		var category = (this.props.category)? this.props.category : false;
		var trending = (category)? '/trending/' + category : '/trending';
		var hot = (category)? '/hot/' + category : '/hot';
		var cashout = (category)? '/cashout/' + category : '/cashout';
		var created = (category)? '/created/' + category : '/created';
		var active = (category)? '/active/' + category : '/active';
		var responses = (category)? '/responses/' + category : '/responses';
		var votes = (category)? '/votes/' + category : '/votes';
		var profile = '/@' + account;
		var posts = '/@' + account + '/posts';
		var feed = '/@' + account + '/feed';
		var replies = '/@' + account + '/replies';
		var wallet = '/@' + account + '/wallet';
		var permissions = '/@' + account + '/permissions';
		return (
			<header>
				<div className="top-nav">
					{!this.props.app.sidebarIsVisible && <a href="#" onClick={() => this.props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
					{this.props.app.sidebarIsVisible && <a href="#" onClick={() => this.props.hideSidebar()}><i className="icon icon-md icon-menu material-icons">arrow_back</i></a>}
					<div className="section-content top-head">
						<Link to="/" onlyActiveOnIndex={true} activeClassName="active"><img src="/img/logo-blue.svg" /></Link>
					</div>
					<a><i className="icon icon-md icon-menu material-icons">notifications</i></a>
				</div>
				{menu == 'primary' && <ul className="app-nav">
					<li><Link to={trending} onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">show_chart</i><span className="hidden-xs"> Trending</span></Link></li>
					<li><Link to={hot} activeClassName="active"><i className="icon icon-md material-icons">whatshot</i><span className="hidden-xs"> Hot</span></Link></li>
					<li><Link to={cashout} activeClassName="active"><i className="icon icon-md material-icons">schedule</i><span className="hidden-xs"> Payout Time</span></Link></li>
					<li><Link to={created} activeClassName="active"><i className="icon icon-md material-icons">fiber_new</i><span className="hidden-xs"> New</span></Link></li>
					<li><Link to={active} activeClassName="active"><i className="icon icon-md material-icons">track_changes</i><span className="hidden-xs"> Active</span></Link></li>
					<li className="hide"><Link to={responses} activeClassName="active"><i className="icon icon-md material-icons">comment</i><span className="hidden-xs"> Responses</span></Link></li>
					<li className="hide"><Link to={votes} activeClassName="active"><i className="icon icon-md material-icons">gavel</i><span className="hidden-xs"> Popular</span></Link></li>
					<li><a href="#" onClick={() => this.props.setMenu('secondary')}><i className="icon icon-md material-icons">expand_more</i></a></li>
				</ul>}
				{menu == 'secondary' && <ul className="app-nav">
					<li><Link to={profile} activeClassName="active"><i className="icon icon-md material-icons">assignment_ind</i><span className="hidden-xs"> Profile</span></Link></li>
					<li><Link to={posts} activeClassName="active"><i className="icon icon-md material-icons">library_books</i><span className="hidden-xs"> Posts</span></Link></li>
					<li><Link to={feed} activeClassName="active"><i className="icon icon-md  material-icons">subject</i><span className="hidden-xs"> Feed</span></Link></li>
					<li className="hide"><Link to={replies} activeClassName="active"><i className="icon icon-md  material-icons">comment</i><span className="hidden-xs"> Replies</span></Link></li>
					<li><Link to={wallet}  activeClassName="active"><i className="icon icon-md material-icons">account_balance_wallet</i><span className="hidden-xs"> Wallet</span></Link></li>
					<li className="hide"><Link to={permissions} activeClassName="active"><i className="icon icon-md material-icons">lock</i><span className="hidden-xs"> Permissions</span></Link></li>
					<li><a href="#" onClick={() => this.props.setMenu('primary')}><i className="icon icon-md material-icons">expand_less</i></a></li>
				</ul>}
				{menu == 'about' && <ul className="app-nav">
					<li><Link to="/about" activeClassName="active"><i className="icon icon-md material-icons">info_outline</i><span className="hidden-xs"> About</span></Link></li>
					<li><Link to="/team" activeClassName="active"><i className="icon icon-md material-icons">group_work</i><span className="hidden-xs"> Team</span></Link></li>
					<li><Link to="/projects" activeClassName="active"><i className="icon icon-md material-icons">all_out</i><span className="hidden-xs"> Projects</span></Link></li>
					<li><Link to="/jobs" activeClassName="active"><i className="icon icon-md material-icons">done</i><span className="hidden-xs"> Jobs</span></Link></li>
					<li><Link to="/donate" activeClassName="active"><i className="icon icon-md material-icons">favorite</i><span className="hidden-xs"> Donate</span></Link></li>
					<li><Link to="/help" activeClassName="active"><i className="icon icon-md material-icons">help_outline</i><span className="hidden-xs"> Help</span></Link></li>
				</ul>}
			</header>
		);
	}
});

var mapStateToProps = function(state){
	return {
		app: state.app,
		auth: state.auth,
		header: state.header
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		showSidebar: function(){ dispatch(actions.showSidebar()); },
		hideSidebar: function(){ dispatch(actions.hideSidebar()); },
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Header);