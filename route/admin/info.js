var Joi = require('joi');

module.exports.GET = {
	method: 'GET',
	path: '/admin',
	config: {
		tags: ['api'],
		description: 'Administration Overview',
		notes: 'Complete list of administrative commands.',
		validate: {
			params: {
				query: Joi.string().required().description('Solr search query')
			},
			query: {}
		}, handler: function (request, reply) {
			'use strict';

		}
	}
};
