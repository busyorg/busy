var React = require("react"),
	ReactRedux = require("react-redux"),
	moment = require('moment'),
	actions = require("../actions"),
	Router = require('react-router'),
	Tabs = require("./../containers/tabs"),
	period = require('./../lib/period');
	Link = require("react-router").Link;

var Header = React.createClass({
	handleChange: function(e) {
		this.props.search(e.target.value);
	},
	componentWillUnmount: function(){
		this.props.search();
	},
	render: function(){
		var base = (this.props.base)? '/' + this.props.base : '';
		return (
			<header>
				<div className="top-nav">
					<a href="#" onClick={() => this.props.showModal('account')}><i className="icon icon-md icon-menu material-icons">menu</i></a>
					<div className="section-content">
						<i className="icon icon-md icon-menu material-icons">search</i>
						<input type="text" className="input-search" onChange={() => this.handleChange} />
					</div>
					{/*<a className="range" href="#" onClick={() => this.props.showModal('date-range')}>
						<i className="icon icon-md icon-menu material-icons">date_range</i>
						<span className="hidden-xs">
							{this.props.auth.range.period && period[this.props.auth.range.period]}
							{!this.props.auth.range.period && moment(this.props.auth.range.from).format('DD-MM-YY') + " - " + moment(this.props.auth.range.to).format('DD-MM-YY')}
						</span>
					</a>*/}
					<a href="#" onClick={() => this.props.refresh()}><i className="icon icon-md icon-menu material-icons">refresh</i></a>
					{this.props.add && <a href="#" onClick={() => this.props.showModal(this.props.add)}><i className="icon icon-md icon-menu material-icons">add</i></a>}
				</div>
				{this.props.header.menu == 'primary'? <ul className="app-nav">
					<li><Link to="/trending" onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">show_chart</i> <span className="hidden-xs">Trending</span></Link></li>
					<li><Link to="/hot" activeClassName="active"><i className="icon icon-md material-icons">lightbulb_outline</i> <span className="hidden-xs">Hot</span></Link></li>
					<li><Link to="/cashout" activeClassName="active"><i className="icon icon-md material-icons">attach_money</i> <span className="hidden-xs">Payout Time</span></Link></li>
					<li><Link to="/created" activeClassName="active"><i className="icon icon-md material-icons">fiber_new</i> <span className="hidden-xs">New</span></Link></li>
					<li><Link to="/active" activeClassName="active"><i className="icon icon-md material-icons">settings_remote</i> <span className="hidden-xs">Active</span></Link></li>
					<li><Link to="/response" activeClassName="active"><i className="icon icon-md material-icons">comment</i> <span className="hidden-xs">Responses</span></Link></li>
					<li><Link to="/popular" activeClassName="active"><i className="icon icon-md material-icons">gavel</i> <span className="hidden-xs">Popular</span></Link></li>
					<li><a href="#" onClick={() => this.props.setMenu('secondary')}><i className="icon icon-md material-icons">expand_more</i></a></li>
				</ul> :
				<ul className="app-nav">
					{/*base && <li><Link to={base} activeClassName="active"><i className="icon icon-md material-icons">track_changes</i> <span className="hidden-xs">Profile</span></Link></li>*/}
					<li><Link to={base + '/posts'} activeClassName="active"><i className="icon icon-md material-icons">library_books</i> <span className="hidden-xs">Posts</span></Link></li>
					<li><Link to={base + '/replies'} activeClassName="active"><i className="icon icon-md  material-icons">comment</i> <span className="hidden-xs">Replies</span></Link></li>
					<li><Link to={base + '/replies'} activeClassName="active"><i className="icon icon-md  material-icons">people</i> <span className="hidden-xs">Friends</span></Link></li>
					<li><Link to={base + '/wallet'} activeClassName="active"><i className="icon icon-md material-icons">account_balance_wallet</i> <span className="hidden-xs">Wallet</span></Link></li>
					<li><Link to={base + '/permissions'} activeClassName="active"><i className="icon icon-md material-icons">lock</i> <span className="hidden-xs">Permissions</span></Link></li>
					<li><a href="#" onClick={() => this.props.setMenu('primary')}><i className="icon icon-md material-icons">expand_less</i></a></li>
				</ul>}
				<Tabs page={this.props.page} hasTab={this.props.subnav} />
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