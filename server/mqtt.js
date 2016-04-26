var mqtt = require('mqtt');

module.exports = function (db) {

	var client = mqtt.connect([
		{ host: process.env.MQTT_URL || 'http://doughnut.kent.ac.uk', port: process.env.MQTT_PORT || 1883 }
	]);

	client.isConnected = false;

	client.on('connect', () => {
		client.subscribe('meditemp/gtvl2/temperature');
		client.subscribe('meditemp/gtvl2/alert');
		console.log('MQTT Socket connected');
		client.isConnected = true;
	});

	client.on('message', (topic, message) => {

		console.log("Received " + topic, message.toString());

		switch (topic) {
			case 'meditemp/gtvl2/temperature':
			try {
				if (/^([A-Z0-9]{4}-[A-Z0-9]{2}-[A-Z0-9]{4});([0-9]{1,3})$/.test(message.toString())) {

					var deviceId = message.toString().substr(0, message.toString().lastIndexOf(';'));
					var temp = parseInt(message.toString().substr(1 + message.toString().lastIndexOf(';')));

					// If the device doesn't exist, create it.
					db.get('devices').findOne({deviceId: deviceId}).success((doc) => {
						if (!doc) {
							db.get('devices').insert({
								deviceId: deviceId,
								products: []
							})
						}
					});

					// Insert the new reading
					db.get('temp_readings').insert({deviceId: deviceId, temperature: temp, createdAt: new Date()}, (err, result) => {
						if (!err && result) {
							console.log(result);
						} else {
							console.error(err);
						}
					});
				}
			} catch (e) {
				console.error(e);
			}
			break;
			case 'meditemp/gtvl2/alert':
			var alert = JSON.parse(message.toString());
			alert.seen = false;
			alert.createdAt = new Date();

			if (alert.product && alert.device) {
				db.get('alerts').insert(alert);
			}
			break;
			default:
			break;
		}
	});

	client.on('close', () => {
		console.error('Connection closed');
		client.isConnected = false;
	});

	client.on('error', (error) => {
		console.error(error);
		client.isConnected = false;
	});

	client.on('offline', () => {
		console.error('Offline');
		client.isConnected = false;
	});

	return client;
};
