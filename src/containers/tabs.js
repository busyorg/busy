var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	moment = require('moment'),
	actions = require("../actions"),
	Router = require('react-router'),
	Link = require("react-router").Link;

var Tabs = React.createClass({
	createTab: function(page) {
		this.props.createTab(page);
		this.forceUpdate();
	},
	deleteTab: function(page) {
		this.props.deleteTab(page);
		this.forceUpdate();
	},
	render: function(){
		return {};
		/*(
			this.props.hasTab || Object.keys(this.props.tabs).length != 0) &&
				<div className="page-top">
					<ul>
						{this.props.tabs.map(function(key) {
							return <li>
								<Link to={'/' + key}>
									{_.has(this.props.pages, key + '.icon') && <span><i className="icon icon-xs material-icons">{this.props.pages[key].icon}</i> </span>}
									{_.has(this.props.pages, key + '.title')? this.props.pages[key].title : key}
								</Link>
								<a href="#" onClick={() => this.deleteTab(key)}><i className="icon icon-xs material-icons">remove</i></a>
							</li>;
						}.bind(this))}
						{this.props.hasTab && !(this.props.tabs.indexOf(this.props.page) != -1) &&
							<li className="active">
								{_.has(this.props.pages, this.props.page + '.icon') && <span><i className="icon icon-xs material-icons">{this.props.pages[this.props.page].icon}</i> </span>}
								{_.has(this.props.pages, this.props.page + '.title')? this.props.pages[this.props.page].title : '...'}
								<a href="#" onClick={() => this.createTab(this.props.page)}><i className="icon icon-xs material-icons">bookmark</i></a>
							</li>}
					</ul>
				</div>
		);
		*/
	}
});
				
var mapStateToProps = function(state){
	return {
		tabs: state.tabs,
		pages: state.pages
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		createTab: function(page){ dispatch(actions.createTab(page)); },
		deleteTab: function(page){ dispatch(actions.deleteTab(page)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Tabs);