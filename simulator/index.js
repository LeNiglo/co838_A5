var mqtt = require('mqtt');
var privateId = process.env.PRIVATE_ID || generateId();
var temp = 1;
var interval = undefined;

function generateId() {
	var id = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	for (var i = 0; i < 10; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length));
		if (i == 3 || i == 5)
		id += '-';
	}
	return id;
}

function publishData() {
	temp += Math.round(Math.random() * 6 - 3);
	console.log(privateId, temp);
	client.publish('gtvl2_temperature', privateId + ';' + temp);
}

var client = mqtt.connect([
	{ host: process.env.MQTT_URL || 'http://doughnut.kent.ac.uk', port: process.env.MQTT_PORT || 1883 }
]);

client.on('connect', () => {
	// client.subscribe('gtvl2_temperature');
	client.subscribe('gtvl2_settings');
	console.log("Simulator connected to MQTT Socket with id " + privateId);
	publishData();
	interval = setInterval(() => {
		publishData();
	}, 60000);
});

client.on('close', () => {
	console.error('Connection closed');
	if (interval)
	clearInterval(interval);
});

client.on('error', (error) => {
	console.error(error);
	if (interval)
	clearInterval(interval);
});

client.on('offline', () => {
	console.error('Offline');
});
