var mqtt = require('mqtt');

module.exports = function (db) {

	var client = mqtt.connect([
		{ host: process.env.MQTT_URL || 'http://doughnut.kent.ac.uk', port: process.env.MQTT_PORT || 1883 }
	]);

	client.isConnected = false;

	client.on('connect', () => {
		client.subscribe('gtvl2_temperature');
		// client.publish('gtvl2_temperature', '1234-56-7890;' + 20);
		console.log('MQTT Socket connected');
		client.isConnected = true;
	});

	client.on('message', (topic, message) => {
		console.log(topic, message.toString());

		switch (topic) {
			case 'gtvl2_temperature':
			try {
				var deviceId = message.toString().substr(0, message.toString().lastIndexOf(';'));
				var temp = parseInt(message.toString().substr(1 + message.toString().lastIndexOf(';')));

				db.get('devices').findOne({deviceId: deviceId}).success((doc) => {
					if (!doc) {
						db.get('devices').insert({
							deviceId: deviceId,
							products: []
						})
					}
				});

				db.get('temp_readings').insert({deviceId: deviceId, temperature: temp, createdAt: new Date()}, (err, result) => {
					if (!err && result) {
						console.log(result);
					} else {
						console.error(err);
					}
				});
			} catch (e) {
				console.error(e);
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
