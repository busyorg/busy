var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Quickstart = require("./../containers/quickstart"),
	Grid = require("./../containers/grid");

var Page = React.createClass({
	componentWillReceiveProps: function (nextProps) {
		if (!nextProps.pages[this.props.page] || (!nextProps.pages[this.props.page].isLoaded && !nextProps.pages[this.props.page].isFetching)) {
			var options = this.props.options;
			//options.from = nextProps.auth.range.from;
			//options.to = nextProps.auth.range.to;
			console.log(options);
			this.props.getFeed(this.props.page, options);
		}
		if (nextProps.pages[this.props.page] && !nextProps.pages[this.props.page].title && nextProps.pages[this.props.base] && nextProps.pages[this.props.base].entry && nextProps.pages[this.props.base].entry.name) {
			this.props.setTitle(this.props.page, nextProps.pages[this.props.base].entry.name);
		}
	},
	componentWillMount: function(){
		this.props.setIcon(this.props.page, this.props.icon);
		if (this.props.base || this.props.menu == 'secondary') {
			this.props.setMenu('secondary');
		}
		if (!this.props.pages[this.props.page] || (!this.props.pages[this.props.page].isLoaded && !this.props.pages[this.props.page].isFetching)) {
			var options = this.props.options;
			//options.from = this.props.auth.range.from;
			//options.to = this.props.auth.range.to;
			console.log(options);
			this.props.getFeed(this.props.page, options);
		}
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header page={this.props.page} base={this.props.base} subnav={this.props.subnav} add={this.props.add} />
				{this.props.pages[this.props.page] && this.props.pages[this.props.page].isFetching && <Loading />}
				{this.props.pages[this.props.page] && _.size(this.props.pages[this.props.page].content) > 0 && <div>
					<div style={{height: '10px', overflow: 'hidden'}}></div>
				</div>}
				{this.props.pages[this.props.page] && _.size(this.props.pages[this.props.page].content) > 0 && <Grid filter={this.props.header.query} title={this.props.gridTitle} content={this.props.pages[this.props.page].content} />}
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth,
		header: state.header,
		pages: state.pages
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		getFeed: function(page, options){ dispatch(actions.getFeed(page, options)); },
		setTitle: function(page, title){ dispatch(actions.setTitle(page, title)); },
		setIcon: function(page, icon){ dispatch(actions.setIcon(page, icon)); },
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Page);