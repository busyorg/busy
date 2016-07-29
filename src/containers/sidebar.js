var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash');

var Sidebar = React.createClass({
	render: function(){
		var current = this.props.pages.current;
		var tags = [];
		if (current.categories) {
			Object.keys(this.props.pages.current.categories).forEach(function(category) {
				tags.push(<li>#{category}</li>);
			});
		}
		return (
			<nav className="sidebar">
				<div className="sidebar-header"></div>
				<ul className="sidebar-content">{tags}</ul>
				<div className="sidebar-footer"></div>
			</nav>
		);
	}
});

var mapStateToProps = function(state){
	return {
		pages: state.pages
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Sidebar);