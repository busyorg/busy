var React = require("react"),
	_ = require('lodash'),
	steem = require('./../../lib/steem'),
	Triggers = require("./../containers/triggers"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Body = require("./../containers/post/body"),
	Replies = require("./../containers/post/replies"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	componentWillMount: function() {
		this.setState({content: {}});
		steem.getContent(this.props.params.author, this.props.params.permlink, function(err, content) {
			this.setState({content: content});
		}.bind(this));
	},
	render: function(){
		var content = this.state.content;
		return (
			<div className="main-panel">
				<Triggers likes="true" replies="true" messages="true" />
				<Header />
					<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
					<div className="single">
						{!_.has(content, 'author') && <Loading />}
						{_.has(content, 'author') &&
						<div className="container">
							<div className="single-content">
								<p><Link to={'/@' + content.author}>@{content.author}</Link></p>
								<h1 className="mvl">{content.title}</h1>
								<Body body={content.body} jsonMetadata={content.json_metadata} />
							</div>
							{content.children > 0 && <div className="single-replies">
								<h2>Comments</h2>
								<Replies parent={content.author} parentPermlink={content.permlink} />
							</div>}
						</div>}
					</div>
			</div>
		);
	}
});