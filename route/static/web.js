module.exports.GET = {
	method: 'GET',
	path: '/static/{path*}',
	handler: {
		directory: {path: './static', listing: false, index: true}
	}
};
