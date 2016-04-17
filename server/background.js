var _ = require('underscore');

module.exports = function(app, db) {

	var obj = {};

	obj.checkProducts = () => {
		db.get('devices').find({}, {}, (error, results) => {
			if (error) console.error(error);
			db.get('temp_readings').find({}, {sort: {createdAt: -1}}, (error, readings) => {
				if (error) console.error(error);

				_.each(results, (device) => {
					var doc = _.findWhere(readings, {deviceId: device.deviceId});
					device.currentTemp = doc.temperature;

					_.each(device.products, (product) => {
						if (doc.temperature >= product.temperature + product.margin || doc.temperature <= product.temperature - product.margin) {
							app.mailer.send('emails/alert', {
								to: 'lefrantguillaume@gmail.com',
								subject: 'Alert for ' + product.name,
								layout: false,
								product: product,
								device: device,
								url: "http://localhost:3000/products"
							}, function (err) {
								if (err) {
									console.error(err);
								} else {
									console.log("Email Sent.");
								}
							});
						}
					});
				});

			});
		});
	}

	obj.interval = setInterval(obj.checkProducts, 900000);

	return obj;
}
