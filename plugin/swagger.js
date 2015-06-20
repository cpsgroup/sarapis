var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

module.exports.core =
{
	register: hapiSwaggered,
	options: {
		tags: {
			'/': 'Sarapis'
		},
		info: {
			title: 'Sarapis API',
			description: 'A proxied Solr REST API to enable easy read-only access to any Solr instance.',
			version: '0.2.0'
		}
	},
	route: {
		select: 'api',
		routes: {
			prefix: '/swagger'
		}
	},
	error: function (err) {
		if (err) {
			throw err
		}
	}
};


module.exports.ui =
{
	register: hapiSwaggeredUi,
	options: {
		title: 'Sarapis API',
		authorization: {
			//field: 'apiKey',
			scope: 'query' // header works as well
			// valuePrefix: 'bearer '// prefix incase
		}
	},
	route: {
		select: 'api',
		routes: {
			prefix: '/docs'
		}
	},
	error: function (err) {
		if (err) {
			throw err
		}
	}
};