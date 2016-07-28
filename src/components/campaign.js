var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	actions = require("../actions"),
	Header = require("./../containers/header"),
	Loading = require("./../containers/loading"),
	Link = require("react-router").Link;

var Campaign = React.createClass({
	componentWillReceiveProps: function (nextProps) {
		this.updateTitle(nextProps);
	},
	componentWillMount: function(){
		var page = 'campaigns/' + this.props.params.id;
		this.props.setIcon(page, 'track_changes');
		this.props.setMenu('secondary');
		this.updateTitle(this.props);
	},
	updateTitle: function(props){
		var page = 'campaigns/' + this.props.params.id;
		if (!_.has(props.pages, page + '.entry')) {
			this.props.getEntry(page, {slug: 'campaigns', id: this.props.params.id});
		}
		if (!_.has(props.pages, page + '.title') && _.has(props.pages, page + '.entry.name')) {
			this.props.setTitle(page, props.pages[page].entry.name);
		}
	},
	render: function(){
		var page = 'campaigns/' + this.props.params.id;
		return (
			<div className="main-panel">
				<Header page={page} base={page} subnav="true" />
				{_.has(this.props.pages, page + '.entry.name')?
					<div className="container text-lg-center">
						<div className="mal">
							<h2>{this.props.pages[page].entry.name}</h2>
							<p><a href={this.props.pages[page].entry.url} target="_blank">{this.props.pages[page].entry.url}</a></p>
						</div>
						<div className="mal">
							<i className="material-icons icon icon-xl">label_outline</i>
							<h1 className="mbl">Offers</h1>
							<Link to={'/' + page + '/offers'} className="btn btn-secondary-outline btn-lg">Browse</Link>
						</div>
						<div className="mal">
							<i className="material-icons icon icon-xl">web</i>
							<h1 className="mbl">Landers</h1>
							<Link to={'/' + page + '/landers'} className="btn btn-secondary-outline btn-lg">Browse</Link>
						</div>
					</div> : <Loading />}
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {pages: state.pages};
};

var mapDispatchToProps = function(dispatch){
	return {
		getEntry: function(page, options){ dispatch(actions.getEntry(page, options)); },
		setTitle: function(page, title){ dispatch(actions.setTitle(page, title)); },
		setIcon: function(page, icon){ dispatch(actions.setIcon(page, icon)); },
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Campaign);