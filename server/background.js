var _ = require('underscore');

module.exports = function(app, db) {

	var obj = {};

	obj.checkProducts = () => {

		console.log("Checking products ...");

		db.get('devices').find({}, {}, (error, results) => {
			if (error) console.error(error);
			db.get('temp_readings').find({}, {sort: {createdAt: -1}}, (error, readings) => {
				if (error) console.error(error);

				_.each(results, (device) => {
					var doc = _.findWhere(readings, {deviceId: device.deviceId});
					device.currentTemp = doc.temperature;

					_.each(device.products, (product) => {
						if (doc.temperature >= product.temperature + product.margin || doc.temperature <= product.temperature - product.margin) {

							// If there is a danger for the product, send an email + publish alert on MQTT channel.
							// Possibility to send a push notification to smartphones via an App

							if (app.get('emailEnabled')) {
								app.mailer.send('emails/alert', {
									to: app.get('adminEmail'),
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

							app.get('mqttClient').publish('meditemp/gtvl2/alert', JSON.stringify({ product: product, device: _.omit(device, 'products') }));
						}
					});
				});

			});
		});
	}

	obj.interval = setInterval(obj.checkProducts, 900000);

	return obj;
}
