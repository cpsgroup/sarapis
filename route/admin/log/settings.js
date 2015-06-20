var Joi = require('joi');

module.exports.GET = {
	method: 'GET',
	path: '/admin/{log}/{field}',
	config: {
		tags: ['api'],
		description: 'Get Log Settings',
		notes: 'Get and set Sarapis server configuration.',
		validate: {
			params: {
				log: Joi.string().required().description('The log on which to operate, i.e. cli, rest or proxy.'),
				field: Joi.string().required().description('The field of information to retrieve, i.e. level, location.')
			},
			query: {}
		}, handler: function (request, reply) {
			'use strict';

		}
	}
};

module.exports.POST = {
	method: 'POST',
	path: '/admin/{log}/{field}/{value}',
	config: {
		tags: ['api'],
		description: 'Set Log Settings',
		notes: 'Get and set Sarapis server configuration.',
		validate: {
			params: {
				log: Joi.string().required().description('The log on which to operate, i.e. cli, rest or proxy.'),
				field: Joi.string().required().description('The field of information to retrieve, i.e. level, location.')
			},
			query: {}
		}, handler: function (request, reply) {
			'use strict';

		}
	}
};
