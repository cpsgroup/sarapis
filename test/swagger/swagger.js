var Lab = require("lab");
var lab = exports.lab = Lab.script();
var code = require("code");

var server = require("../../sarapis.js");
server.registerRoutes();
server.registerPlugins();
var spec = require('./swagger-spec.json');


lab.experiment("Swagger", {parallel: false}, function () {

	lab.test("Spec URL is available",
		function (done) {


			var options = {method: "GET", url: "/swagger/swagger"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(response.statusCode).to.equal(200);

				done();
			});
		});

	lab.test("response type is a swagger object",
		function (done) {


			var options = {method: "GET", url: "/swagger/swagger"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(result).to.be.instanceof(Object);

				done();
			});
		});

	lab.test("version is 2.0",
		function (done) {


			var options = {method: "GET", url: "/swagger/swagger"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(result.swagger).to.equal('2.0');

				done();
			});
		});

	lab.test("lists all endpoints are in the spec",
		function (done) {


			var options = {method: "GET", url: "/swagger/swagger"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect('/admin' in result.paths).to.be.true();
				code.expect('/admin/{log}' in result.paths).to.be.true();
				code.expect('/admin/{log}/{field}' in result.paths).to.be.true();
				code.expect('/admin/{log}/{field}/{value}' in result.paths).to.be.true();
				code.expect('/solr/{query}' in result.paths).to.be.true();

				done();
			});
		});
});
