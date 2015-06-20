module.exports.GET = {
	path: '/',
	method: 'GET',
	handler: function (request, reply) {
		reply.redirect('/static')
	}
};
