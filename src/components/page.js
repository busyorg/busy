var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Feed = require("./../containers/feed");

var Page = React.createClass({
	componentWillReceiveProps: function (nextProps) {
		if (!nextProps.app.isLoaded && !nextProps.app.isFetching) {
			var path = this.props.params.path;
			this.props.getFeed('slug', {path: path});
		}
	},
	componentWillMount: function(){
		if (!this.props.app.isLoaded && !this.props.app.isFetching) {
			var path = this.props.params.path;
			this.props.getFeed('slug', {path: path});
		}
		if (this.props.base || this.props.menu == 'secondary') {
			this.props.setMenu('secondary');
		}
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
		getFeed: function(page, options){ dispatch(actions.getFeed(page, options)); },
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Page);