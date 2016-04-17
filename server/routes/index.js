var express = require('express');
var _ = require('underscore');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

	req.db.get('devices').find({}, {}, (error, results) => {
		if (error) console.error(error);
		req.db.get('temp_readings').find({}, {sort: {createdAt: -1}}, (error, readings) => {
			if (error) console.error(error);

			var devices = [];

			_.each(results, (elem, index) => {
				var docs = _.filter(readings, (temp) => { return temp.deviceId === elem.deviceId });
				devices.push({device: elem, temperatures: docs.slice(0, 20).reverse()});
			});

			res.render('dashboard', { devices: devices });
		});
	});
});

module.exports = router;
