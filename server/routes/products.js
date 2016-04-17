var express = require('express');
var _ = require('underscore');
var router = express.Router();

/* GET products listing. */
router.get('/', (req, res, next) => {

	req.db.get('devices').find({}, {}, (error, results) => {
		if (error) console.error(error);
		req.db.get('temp_readings').find({}, {sort: {createdAt: -1}}, (error, readings) => {
			if (error) console.error(error);

			_.map(results, (device) => {
				var doc = _.findWhere(readings, {deviceId: device.deviceId});
				device.currentTemp = doc.temperature;

				_.map(device.products, (product) => {
					product.warning = (doc.temperature >= product.temperature + product.margin || doc.temperature <= product.temperature - product.margin);
					return product;
				});
				return device;
			});

			res.render('products', { devices: results });
		});
	});
});

router.post('/add', (req, res, next) => {
	var product = {
		name: req.body.productName,
		temperature: req.body.productTemp,
		margin: req.body.productTempMargin
	};

	req.db.get('devices').findAndModify({
		query: {deviceId: req.body.device},
		update: {$push: {products: product} }
	}, (error, doc) => {
		if (error) console.error(error);
		res.redirect('./');
	});

});

module.exports = router;
