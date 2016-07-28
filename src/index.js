var React = require('react'),
	ReactDOM = require('react-dom'),
	Router = require('react-router').Router,
	Provider = require('react-redux').Provider,
	store = require('./store'),
	routes = require('./routes'),

	routerHistory = require('react-router').useRouterHistory,
	createHistory = require('history').createHistory,
	appHistory = routerHistory(createHistory)({ queryKey: false });

ReactDOM.render(
	<Provider store={store}>
		<Router routes={routes} history={appHistory} />
	</Provider>,
	document.getElementById('app')
);