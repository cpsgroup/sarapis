var hapi = require('hapi');
var Joi = require('joi');
var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'sarapis-cli', level: 'debug', streams: [{
        stream: process.stdout, level: 'debug'
    }, {path: './sarapis-cli.log', level: 'debug'}]
});

var argv = require('yargs')
    .usage('Usage: $0 --solr-host [string] --solr-port [num]')
    .demand(['solr-host', 'solr-port'])
    .describe('solr-host', 'Specify the host address of the Solr instance to connect to.')
    .describe('solr-port', 'Specify the port of the Solr instance to connect to.')
    .describe('solr-core', 'Specify the core of the Solr instance to connect to.')
    .describe('solr-allow', 'Specify the methods to be allowed on the Solr instance.')
    .describe('solr-deny', 'Specify the parameters to be prohibited on the Solr instance..')
    .describe('proxy-port', 'Specify the port of the Solr proxy.')
    .describe('proxy-path', 'Specify the valid paths of the Solr proxy.')
    .describe('sarapis-port', 'Specify the port of this Sarapis server instance.')
    .version(function () {
        return require('./package.json').version;
    })
    .epilog('Copyright 2015')
    .argv;
log.info(argv);

var SOLR_HOST = argv.solrHost || 'localhost';
var SOLR_PORT = argv.solrPort || 8983;
var SOLR_CORE = argv.solrCore;
var SOLR_VALID_METHODS = argv.solrAllow || ['GET', 'HEAD'];
var SOLR_INVALID_PARAMS = argv.solrDeny || ['qt', 'stream'];
var PROXY_HOST = argv.proxyHost;
var PROXY_PORT = argv.proxyPort || 9090;
//var PROXY_PATH = argv.proxyPath != undefined ? argv.proxyPath.split(',') : [];
var PROXY_PATH = argv.proxyPath || ['/solr/select'];
var SARAPIS_PORT = argv.sarapisPort || 3000;

if (SOLR_CORE != undefined) {
    PROXY_PATH.push('/solr/' + SOLR_CORE + '/select')
}
log.info();


//var args = [];
//var DEBUG = process.env.DEBUG != undefined ? process.env.DEBUG.indexOf('solr-proxy') > 1 ? true : false : false;
//var PROXY_PORT = process.env.PROXY_PORT != undefined ? parseInt(process.env.PROXY_PORT) : 9090;
//var SOLR_HOST = process.env.SOLR_HOST != undefined ? process.env.SOLR_HOST : 'localhost';
//var SOLR_PORT = process.env.SOLR_PORT != undefined ? parseInt(process.env.SOLR_PORT) : 8080;
//var SOLR_VALID_METHODS = process.env.SOLR_VALID_METHODS != undefined ? process.env.SOLR_VALID_METHODS.split(',') : [];
//var SOLR_VALID_PATHS = process.env.SOLR_VALID_PATHS != undefined ? process.env.SOLR_VALID_PATHS.split(',') : [];
//var SOLR_INVALID_PARAMS = process.env.SOLR_INVALID_PARAMS != undefined ? process.env.SOLR_INVALID_PARAMS.split(',') : [];
//args.push(DEBUG, SOLR_HOST, SOLR_PORT, SOLR_VALID_METHODS, SOLR_VALID_PATHS, SOLR_INVALID_PARAMS);
//console.log(args);

//startup our proxy that we make our calls against
//we may even expose it to the outside world
var solrProxy = require('solr-proxy');
var solrProxyOptions = {
    listenPort: PROXY_PORT,
    validHttpMethods: SOLR_VALID_METHODS,
    validPaths: PROXY_PATH,
    invalidParams: SOLR_INVALID_PARAMS,
    backend: {
        host: SOLR_HOST,
        port: SOLR_PORT
    }
};
solrProxy.start(9090, solrProxyOptions);

var solrClient = require('solr-client');
var proxyClient = solrClient.createClient(PROXY_HOST, PROXY_PORT, SOLR_CORE);


var restServer = new hapi.Server();
restServer.connection({port: SARAPIS_PORT, labels: ['api']});

restServer.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
        reply.redirect('/static')
    }
});

restServer.route({
    method: 'GET',
    path: '/static/{path*}',
    handler: {
        directory: {path: './static', listing: false, index: true}
    }
});

restServer.route({
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
});

restServer.route({
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
});

restServer.route({
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
});

restServer.route({
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
});

restServer.route({
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
                var filterObject = {field: rangeFilter[0], page: rangeFilter[1], end: rangeFilter[2]};
                query.rangeFilter(filterObject);
            }


            proxyClient.search(query, function (err, obj) {
                if (err) {
                    restServer.log('error', err);
                    reply({"numFound": 0, "page": 0, "maxScore": 0, "docs": []});
                } else {
                    reply(obj.response);
                }
            });

        }
    }
});

restServer.register({
    register: require('hapi-bunyan'),
    options: {
        logger: bunyan.createLogger({
            name: 'sarapis-rest', level: 'debug', streams: [{
                stream: process.stdout, level: 'debug'
            }, {path: './sarapis-rest.log', level: 'debug'}]
        })
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }


});

restServer.register({
    register: hapiSwaggered,
    options: {
        tags: {
            '/': 'Sarapis'
        },
        info: {
            title: 'Sarapis API',
            description: 'A proxied Solr REST API to enable easy read-only access to any Solr instance.',
            version: '0.1.0'
        }
    }
}, {
    select: 'api',
    routes: {
        prefix: '/swagger'
    }
}, function (err) {
    if (err) {
        throw err
    }
});

restServer.register({
    register: hapiSwaggeredUi,
    options: {
        title: 'Sarapis API',
        authorization: {
            //field: 'apiKey',
            scope: 'query' // header works as well
            // valuePrefix: 'bearer '// prefix incase
        }
    }
}, {
    select: 'api',
    routes: {
        prefix: '/docs'
    }
}, function (err) {
    if (err) {
        throw err
    }
});

restServer.start(function () {
    restServer.log('info', 'Server running at: ' + restServer.info.uri);
});
