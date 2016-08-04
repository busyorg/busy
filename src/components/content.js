var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	steemembed = require('steemembed'),
	marked = require('marked'),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading");

var Content = React.createClass({
	getInitialState: function() {
		this.props.getContent(this.props.params.author, this.props.params.permlink);
		return {
			key: Math.random()
		};
	},
	render: function(){
		var single = this.props.pages.single;
		return (
			<div className="main-panel">
				<Header />
						<div className="single">
							{this.props.pages.single && this.props.app.isFetching && <Loading />}
							{this.props.pages.single && !this.props.app.isFetching && _.size(this.props.pages.single.content) > 0 &&
								<div className="container">
									<h1 className="mvl">{single.content.title}</h1>
									<div dangerouslySetInnerHTML={{__html: marked(single.content.body)}} />
								</div>
							}
						</div>
					}
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		app: state.app,
		pages: state.pages
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		getContent: function(author, permlink){ dispatch(actions.getContent(author, permlink)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Content);