var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	Header = require("./header"),
	Loading = require("./loading"),
	Feed = require("./feed");

var Page = React.createClass({
	componentWillReceiveProps: function (nextProps) {
		var path = this.props.path;
		if (nextProps.pages.current.path !== path && !nextProps.pages.current.isFetching && !nextProps.pages.current.isLoaded) {
			this.props.getFeed(path, {path: path});
		}
		if (this.props.base || this.props.menu == 'secondary') {
			this.props.setMenu('secondary');
		}
	},
	componentWillMount: function () {
		var path = this.props.path;
		if (this.props.pages.current.path !== path) {
			this.props.getFeed(path, {path: path});
		}
		if (this.props.base || this.props.menu == 'secondary') {
			this.props.setMenu('secondary');
		}
	},
	componentWillUnMount: function () {
		this.props.clearFeed();
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header base={this.props.base} subnav={this.props.subnav} add={this.props.add} />
				{this.props.pages.current && this.props.app.isFetching && <Loading />}
				{this.props.pages.current && _.size(this.props.pages.current.content) > 0 && <div>
					<div style={{height: '20px', overflow: 'hidden'}}></div>
				</div>}
				{this.props.pages.current && _.size(this.props.pages.current.content) > 0 && <Feed filter={this.props.header.query} title={this.props.gridTitle} content={this.props.pages.current.content} />}
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		app: state.app,
		header: state.header,
		pages: state.pages
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		getFeed: function(path, options){ dispatch(actions.getFeed(path, options)); },
		clearFeed: function(){ dispatch(actions.clearFeed()); },
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Page);