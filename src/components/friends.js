var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	actions = require('../actions'),
	Header = require('./../containers/header'),
	Loading = require('./../containers/loading'),
	Feed = require('./../containers/Feed');

var Content = React.createClass({
	getInitialState: function() {
		this.props.getFollowingPosts('fabien');
		return {
			key: Math.random()
		};
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				{this.props.pages.current && this.props.app.isFetching && <Loading />}
				{this.props.pages.current && _.size(this.props.pages.current.content) > 0 && <div>
					<div style={{height: '20px', overflow: 'hidden'}}></div>
				</div>}
				{this.props.pages.current && _.size(this.props.pages.current.content) > 0 && <Feed filter={this.props.header.query} content={this.props.pages.current.content} />}
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
		getFollowingPosts: function(follower){ dispatch(actions.getFollowingPosts(follower)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Content);