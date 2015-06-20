module.exports = function (proxy, log) {
	var Joi = require('joi');
	var proxyClient = proxy;

	var query = {};

	query.GET = {
		method: 'GET',
		path: '/solr/{query}',
		config: {
			tags: ['api'],
			description: 'Solr Search',
			notes: 'Extended DisMax Syntax applies, refer to https://cwiki.apache.org/confluence/display/solr/The+Extended+DisMax+Query+Parser for additional information.',
			validate: {
				params: {
					query: Joi.string().required().description('Solr search query')
				},
				query: {
					page: Joi.number().integer().min(0).description('Pagination offset, e.g. 5'),
					rows: Joi.number().integer().min(0).description('Number of results per page, e.g. 100'),
					sort: Joi.string().description('Sort function, e.g. id desc, price asc'),
					rangeFilter: Joi.string().description('Restrict results to field values in range, e.g. price,5,30'),
					matchFilter: Joi.string().description('Restrict results to matching field values, e.g. author, tolkien'),
					restrict: Joi.string().description('Restrict results to specified fields, e.g. id,size,weight'),
					groupBy: Joi.string().description('Group results with the specified field, e.g. publisher'),
					group: Joi.object().keys({
						on: Joi.boolean(),
						field: Joi.string()
					}).description('Group results according to the given options object, e.g. {on=true,field="publisher"}'),
					facet: Joi.object().description('Create a facet according to the given options object, e.g. {on=true,query="author"}'),
					timeout: Joi.number().integer().min(0).max(10000).description('Limit response time in milliseconds and get preliminary results, e.g. 10')
				}
			}, handler: function (request, reply) {
				'use strict';

				var page = request.query.page || 0;
				var rows = request.query.rows || 10;
				var sort = request.query.sort || '';
				var rangeFilter = request.query.rangeFilter != undefined ? request.query.rangeFilter.split(',') : [];
				var matchFilter = request.query.matchFilter != undefined ? request.query.matchFilter.split(',') : [];
				var restrict = request.query.restrict || '';
				var timeout = request.query.timeout || 0;

				//TODO: group, groupBy, facet

				var query = proxyClient
					.createQuery()
					.q(request.params.query)
					.edismax()
					.start(page)
					.rows(rows)
					.sort(sort)
					.timeout(timeout);

				if (restrict !== '') {
					query.restrict(restrict);
				}

				if (matchFilter.length == 2) {
					query.matchFilter(matchFilter[0], matchFilter[1]);
				}

				if (rangeFilter.length == 3) {
					var filterObject = {field: rangeFilter[0], start: rangeFilter[1], end: rangeFilter[2]};
					query.rangeFilter(filterObject);
				}

				proxyClient.search(query, function (err, obj) {
					if (err) {
						log('error', err);
						reply({"numFound": 0, "start": 0, "maxScore": 0, "docs": []});
					} else {
						reply(obj.response);
					}
				});

			}
		}
	};

	return query;
};
