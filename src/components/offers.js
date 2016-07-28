var React = require("react"),
	Page = require("./../containers/page");

module.exports = React.createClass({
	render: function(){
		var page = 'offers';
		var base = '';
		var subnav = false;
		var report = {groupBy: 'offer'};
		var fields = [];
		if (this.props.params.type && this.props.params.id) {
			page = this.props.params.type + '/' + this.props.params.id + '/offers';
			base = this.props.params.type + '/' + this.props.params.id;
			if (this.props.params.type == 'campaigns') { report.campaignId = this.props.params.id; fields.push('bandit'); }
			if (this.props.params.type == 'traffic-sources') { report.trafficSourceId = this.props.params.id; }
			if (this.props.params.type == 'flows') { report.flowId = this.props.params.id; }
			if (this.props.params.type == 'landers') { report.landerId = this.props.params.id; }
			if (this.props.params.type == 'offers') { report.offerId = this.props.params.id; }
			if (this.props.params.type == 'affiliate-networks') { report.affiliateNetworkId = this.props.params.id; }
			subnav = true;
		}
		return (
			<Page
				page={page}
				base={base}
				subnav={subnav}
				title="Offers"
				icon="label_outline"
				fields={fields}
				report={report}
				add="offer"
			/>
		);
	}
});