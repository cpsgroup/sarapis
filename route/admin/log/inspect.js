var Joi = require('joi');

module.exports.GET = {
	method: 'GET',
	path: '/admin/{log}',
	config: {
		tags: ['api'],
		description: 'Inspect Logs',
		notes: 'Get and set Sarapis server configuration.',
		validate: {
			params: {
				log: Joi.string().required().description('The log on which to operate, i.e. cli, rest or proxy.')
			},
			query: {
				append: Joi.boolean().description('Whether to only append new log entries; default is true, will serve log entries from log files otherwise.')
			}
		}, handler: function (request, reply) {
			'use strict';

		}
	}
};
