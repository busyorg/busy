var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions"),
	Link = require("react-router").Link;

var Header = React.createClass({
	handleChange: function(e) {
		this.props.search(e.target.value);
	},
	componentWillUnmount: function(){
		this.props.search();
	},
	render: function(){
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
		var replies = '/@' + account + '/replies';
		var friends = '/@' + account + '/friends';
		var wallet = '/@' + account + '/wallet';
		var permissions = '/@' + account + '/permissions';
		return (
			<header>
				<div className="top-nav">
					<a className="visible-xs" href="#" onClick={() => ''}><i className="icon icon-md icon-menu material-icons">menu</i></a>
					<a className="hidden-xs" href="#" onClick={() => ''}><i className="icon icon-md icon-menu material-icons">arrow_back</i></a>
					<div className="section-content top-head">
						<Link to="/" onlyActiveOnIndex={true} activeClassName="active"><img src="/img/logo-blue.svg" /></Link>
					</div>
					<a href="#"><i className="icon icon-md icon-menu material-icons">add</i></a>
				</div>
				{this.props.header.menu == 'primary' && <ul className="app-nav">
					<li><Link to={trending} onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">show_chart</i><span className="hidden-xs"> Trending</span></Link></li>
					<li><Link to={hot} activeClassName="active"><i className="icon icon-md material-icons">lightbulb_outline</i><span className="hidden-xs"> Hot</span></Link></li>
					<li><Link to={cashout} activeClassName="active"><i className="icon icon-md material-icons">attach_money</i><span className="hidden-xs"> Payout Time</span></Link></li>
					<li><Link to={created} activeClassName="active"><i className="icon icon-md material-icons">fiber_new</i><span className="hidden-xs"> New</span></Link></li>
					<li><Link to={active} activeClassName="active"><i className="icon icon-md material-icons">settings_remote</i><span className="hidden-xs"> Active</span></Link></li>
					<li className="hide"><Link to={responses} activeClassName="active"><i className="icon icon-md material-icons">comment</i><span className="hidden-xs"> Responses</span></Link></li>
					<li className="hide"><Link to={votes} activeClassName="active"><i className="icon icon-md material-icons">gavel</i><span className="hidden-xs"> Popular</span></Link></li>
					<li><a href="#" onClick={() => this.props.setMenu('secondary')}><i className="icon icon-md material-icons">expand_more</i></a></li>
				</ul>}
				{this.props.header.menu == 'secondary' && <ul className="app-nav">
					<li><Link to={profile} activeClassName="active"><i className="icon icon-md material-icons">assignment_ind</i><span className="hidden-xs"> Profile</span></Link></li>
					<li><Link to={posts} activeClassName="active"><i className="icon icon-md material-icons">library_books</i><span className="hidden-xs"> Posts</span></Link></li>
					<li><Link to={replies} activeClassName="active"><i className="icon icon-md  material-icons">comment</i><span className="hidden-xs"> Replies</span></Link></li>
					<li><Link to={friends} activeClassName="active"><i className="icon icon-md  material-icons">people</i><span className="hidden-xs"> Friends</span></Link></li>
					<li><Link to={wallet}  activeClassName="active"><i className="icon icon-md material-icons">account_balance_wallet</i><span className="hidden-xs"> Wallet</span></Link></li>
					<li className="hide"><Link to={permissions} activeClassName="active"><i className="icon icon-md material-icons">lock</i><span className="hidden-xs"> Permissions</span></Link></li>
					<li><a href="#" onClick={() => this.props.setMenu('primary')}><i className="icon icon-md material-icons">expand_less</i></a></li>
				</ul>}
				{this.props.header.menu == 'about' && <ul className="app-nav">
					<li><Link to="/about" activeClassName="active"><i className="icon icon-md material-icons">info_outline</i><span className="hidden-xs"> About</span></Link></li>
				</ul>}
			</header>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth,
		header: state.header
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		showModal: function(page){ dispatch(actions.showModal(page)); },
		search: function(query){ dispatch(actions.search(query)); },
		refresh: function(){ dispatch(actions.refresh()); },
		createTab: function(page){ dispatch(actions.createTab(page)); },
		deleteTab: function(page){ dispatch(actions.deleteTab(page)); },
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Header);