var React = require("react"),
	Page = require("./../containers/page");

module.exports = React.createClass({
	render: function(){
		var page = 'offers/' + this.props.params.id;
		return (
			<Page
				page={page}
				base={page}
				subnav="true"
				title="Overview"
				gridTitle="Campaigns"
				icon="track_changes"
				report={{
					offerId: this.props.params.id,
					groupBy: 'campaign'
				}}
			/>
		);
	}
});