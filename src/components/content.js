var React = require("react"),
	_ = require('lodash'),
	api = require('./../steem'),
	moment = require('moment'),
	Triggers = require("./../containers/triggers"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Body = require("./../containers/post/body"),
	Replies = require("./../containers/post/replies"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	componentWillMount: function() {
		this.setState({content: {}});
		api.getContent(this.props.params.author, this.props.params.permlink, function(err, content) {
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
							<div style={{overflow: 'hidden', height: '40px', lineHeight: '40px'}}>
								<Link to={'/@' + content.author}>
		                <span className="avatar avatar-sm pull-left">
		                  <img src={'https://img.busy6.com/@' + content.author} width="40" height="40" />
		                </span> <span className="pull-left mls">@{content.author}</span>
								</Link>
								<span className="pull-right">{moment(content.created).fromNow()} <a href="#"><i className="icon icon-md material-icons">bookmark_border</i></a></span>
							</div>
							<div className="single-content">
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