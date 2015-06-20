var rewire = require('rewire');
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var code = require("code");

//let's rewire some of sarapis' internal code:

//overwrite the solr client's search call with a mock function
var server = rewire("../../sarapis.js");
var mockSolrSearch = function (query, callback) {
	var searchTerm = query.parameters[0];
	var matchFilter = query.parameters[6] || '';

	if (matchFilter == '' && (searchTerm == 'q=*' || searchTerm == 'q=*.*')) {
		callback(undefined, {response: all});
	}
	else if (searchTerm == 'q=company') {
		callback(undefined, {
			response: {
				"numFound": 1,
				"start": 0,
				"maxScore": 1,
				"docs": [
					{
						"id": "0812521390",
						"cat": [
							"book"
						],
						"name": [
							"The Black Company"
						],
						"price": [
							6.99
						],
						"inStock": [
							false
						],
						"author": [
							"Glen Cook"
						],
						"series_t": [
							"The Chronicles of The Black Company"
						],
						"sequence_i": 1,
						"genre_s": "fantasy",
						"_version_": 1503485823038783500
					}]
			}
		});
	}
	else if (searchTerm == 'q=*.*' && matchFilter == 'fq=inStock:true') {
		callback(undefined, {response: inStock})
	}
	else {
		callback(undefined, {response: empty})
	}
};
server.__set__({
	'proxyClient.search': mockSolrSearch
});

//register routes and plugins manually
server.registerRoutes();
server.registerPlugins();

lab.experiment("Query", {parallel: false}, function () {
	lab.test("*.* returns all documents",
		function (done) {


			var options = {method: "GET", url: "/solr/*.*"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(result).to.equal(all);

				done();
			});
		});

	lab.test("'company' returns The Black Company",
		function (done) {


			var options = {method: "GET", url: "/solr/company"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(result.docs[0].name[0]).to.equal('The Black Company');

				done();
			});
		});

	lab.test("'this is utter crap' returns an empty result set",
		function (done) {


			var options = {method: "GET", url: "/solr/this is utter crap"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(result).to.equal(empty);

				done();
			});
		});

	lab.test("matching any with inStock=true returns 8 results",
		function (done) {


			var options = {method: "GET", url: "/solr/*.*?matchFilter=inStock%2Ctrue"};
			server.inject(options, function (response) {
				var result = response.result;

				code.expect(result.numFound).to.equal(8);

				done();
			});
		});

});

var empty = {"numFound": 0, "start": 0, "maxScore": 0, "docs": []};

var all = {
	"numFound": 10,
	"start": 0,
	"maxScore": 1,
	"docs": [
		{
			"id": "0812521390",
			"cat": [
				"book"
			],
			"name": [
				"The Black Company"
			],
			"price": [
				6.99
			],
			"inStock": [
				false
			],
			"author": [
				"Glen Cook"
			],
			"series_t": [
				"The Chronicles of The Black Company"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485823038783500
		},
		{
			"id": "0441385532",
			"cat": [
				"book"
			],
			"name": [
				"Jhereg"
			],
			"price": [
				7.95
			],
			"inStock": [
				false
			],
			"author": [
				"Steven Brust"
			],
			"series_t": [
				"Vlad Taltos"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485833067364400
		},
		{
			"id": "0380014300",
			"cat": [
				"book"
			],
			"name": [
				"Nine Princes In Amber"
			],
			"price": [
				6.99
			],
			"inStock": [
				true
			],
			"author": [
				"Roger Zelazny"
			],
			"series_t": [
				"the Chronicles of Amber"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485833072607200
		},
		{
			"id": "0805080481",
			"cat": [
				"book"
			],
			"name": [
				"The Book of Three"
			],
			"price": [
				5.99
			],
			"inStock": [
				true
			],
			"author": [
				"Lloyd Alexander"
			],
			"series_t": [
				"The Chronicles of Prydain"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485833074704400
		},
		{
			"id": "080508049X",
			"cat": [
				"book"
			],
			"name": [
				"The Black Cauldron"
			],
			"price": [
				5.99
			],
			"inStock": [
				true
			],
			"author": [
				"Lloyd Alexander"
			],
			"series_t": [
				"The Chronicles of Prydain"
			],
			"sequence_i": 2,
			"genre_s": "fantasy",
			"_version_": 1503485833104064500
		},
		{
			"id": "0553573403",
			"cat": [
				"book"
			],
			"name": [
				"A Game of Thrones"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"George R.R. Martin"
			],
			"series_t": [
				"A Song of Ice and Fire"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485823039832000
		},
		{
			"id": "0553579908",
			"cat": [
				"book"
			],
			"name": [
				"A Clash of Kings"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"George R.R. Martin"
			],
			"series_t": [
				"A Song of Ice and Fire"
			],
			"sequence_i": 2,
			"genre_s": "fantasy",
			"_version_": 1503485824266666000
		},
		{
			"id": "055357342X",
			"cat": [
				"book"
			],
			"name": [
				"A Storm of Swords"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"George R.R. Martin"
			],
			"series_t": [
				"A Song of Ice and Fire"
			],
			"sequence_i": 3,
			"genre_s": "fantasy",
			"_version_": 1503485824353697800
		},
		{
			"id": "0553293354",
			"cat": [
				"book"
			],
			"name": [
				"Foundation"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"Isaac Asimov"
			],
			"series_t": [
				"Foundation Novels"
			],
			"sequence_i": 1,
			"genre_s": "scifi",
			"_version_": 1503485824357892000
		},
		{
			"id": "0812550706",
			"cat": [
				"book"
			],
			"name": [
				"Ender's Game"
			],
			"price": [
				6.99
			],
			"inStock": [
				true
			],
			"author": [
				"Orson Scott Card"
			],
			"series_t": [
				"Ender"
			],
			"sequence_i": 1,
			"genre_s": "scifi",
			"_version_": 1503485824379912200
		}
	]
};

var inStock = {
	"numFound": 8,
	"start": 0,
	"maxScore": 1,
	"docs": [
		{
			"id": "0380014300",
			"cat": [
				"book"
			],
			"name": [
				"Nine Princes In Amber"
			],
			"price": [
				6.99
			],
			"inStock": [
				true
			],
			"author": [
				"Roger Zelazny"
			],
			"series_t": [
				"the Chronicles of Amber"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485833072607200
		},
		{
			"id": "0805080481",
			"cat": [
				"book"
			],
			"name": [
				"The Book of Three"
			],
			"price": [
				5.99
			],
			"inStock": [
				true
			],
			"author": [
				"Lloyd Alexander"
			],
			"series_t": [
				"The Chronicles of Prydain"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485833074704400
		},
		{
			"id": "080508049X",
			"cat": [
				"book"
			],
			"name": [
				"The Black Cauldron"
			],
			"price": [
				5.99
			],
			"inStock": [
				true
			],
			"author": [
				"Lloyd Alexander"
			],
			"series_t": [
				"The Chronicles of Prydain"
			],
			"sequence_i": 2,
			"genre_s": "fantasy",
			"_version_": 1503485833104064500
		},
		{
			"id": "0553573403",
			"cat": [
				"book"
			],
			"name": [
				"A Game of Thrones"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"George R.R. Martin"
			],
			"series_t": [
				"A Song of Ice and Fire"
			],
			"sequence_i": 1,
			"genre_s": "fantasy",
			"_version_": 1503485823039832000
		},
		{
			"id": "0553579908",
			"cat": [
				"book"
			],
			"name": [
				"A Clash of Kings"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"George R.R. Martin"
			],
			"series_t": [
				"A Song of Ice and Fire"
			],
			"sequence_i": 2,
			"genre_s": "fantasy",
			"_version_": 1503485824266666000
		},
		{
			"id": "055357342X",
			"cat": [
				"book"
			],
			"name": [
				"A Storm of Swords"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"George R.R. Martin"
			],
			"series_t": [
				"A Song of Ice and Fire"
			],
			"sequence_i": 3,
			"genre_s": "fantasy",
			"_version_": 1503485824353697800
		},
		{
			"id": "0553293354",
			"cat": [
				"book"
			],
			"name": [
				"Foundation"
			],
			"price": [
				7.99
			],
			"inStock": [
				true
			],
			"author": [
				"Isaac Asimov"
			],
			"series_t": [
				"Foundation Novels"
			],
			"sequence_i": 1,
			"genre_s": "scifi",
			"_version_": 1503485824357892000
		},
		{
			"id": "0812550706",
			"cat": [
				"book"
			],
			"name": [
				"Ender's Game"
			],
			"price": [
				6.99
			],
			"inStock": [
				true
			],
			"author": [
				"Orson Scott Card"
			],
			"series_t": [
				"Ender"
			],
			"sequence_i": 1,
			"genre_s": "scifi",
			"_version_": 1503485824379912200
		}
	]
};
