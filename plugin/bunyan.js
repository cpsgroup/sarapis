module.exports = function (restLog) {
	return {
		register: require('hapi-bunyan'),
		options: {
			logger: restLog
		},
		callback: function (err) {
			if (err) {
				throw err;
			}
		}
	}
};
