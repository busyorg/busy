var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	Triggers = require("./../containers/triggers"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Body = require("./../containers/post/body"),
	Comments = require("./../containers/post/comments"),
	Link = require("react-router").Link;

var Content = React.createClass({
	componentWillMount: function() {
		this.props.getContent(this.props.params.author, this.props.params.permlink);
	},
	render: function(){
		var single = this.props.pages.single;
		var jsonMetadata = {};
		try { jsonMetadata = JSON.parse(single.json_metadata); } catch(e) {}
		return (
			<div className="main-panel">
				<Triggers messages="true" replies="true" />
				<Header />
					<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
					<div className="single">
						{this.props.pages.single && this.props.app.isFetching && <Loading />}
						{this.props.pages.single && !this.props.app.isFetching && _.size(this.props.pages.single.content) > 0 &&
							<div className="container">
								<p><Link to={'/@' + single.content.author}>@{single.content.author}</Link></p>
								<h1 className="mvl">{single.content.title}</h1>
								<Body body={single.content.body} jsonMetadata={jsonMetadata} />
								{single.content.children > 0 && <Comments parent={single.content.author} parentPermlink={single.content.permlink} />}
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