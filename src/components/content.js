var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	Triggers = require("./../containers/triggers"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Body = require("./../containers/post/body"),
	Replies = require("./../containers/post/replies"),
	Link = require("react-router").Link;

var Content = React.createClass({
	componentWillMount: function() {
		this.props.getContent(this.props.params.author, this.props.params.permlink);
	},
	render: function(){
		var single = this.props.pages.single;
		return (
			<div className="main-panel">
				<Triggers likes="true" replies="true" messages="true" />
				<Header />
					<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
					<div className="single">
						{this.props.app.isFetching && <Loading />}
						{!this.props.app.isFetching && _.size(single.content) > 0 &&
						<div className="container">
							<div className="single-content">
								<p><Link to={'/@' + single.content.author}>@{single.content.author}</Link></p>
								<h1 className="mvl">{single.content.title}</h1>
								<Body body={single.content.body} jsonMetadata={single.content.json_metadata} />
							</div>
							{single.content.children > 0 && <div className="single-replies">
								<h2>Comments</h2>
								<Replies parent={single.content.author} parentPermlink={single.content.permlink} />
							</div>}
						</div>}
					</div>
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