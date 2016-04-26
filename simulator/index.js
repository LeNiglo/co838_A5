var mqtt = require('mqtt');
var privateId = process.env.PRIVATE_ID || generateId();
var temp = 1;
var interval = undefined;
var intervalDelay = 60000;

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
	temp += Math.round(Math.random() * 2) - 1;
	console.log(privateId, temp);
	client.publish('meditemp/gtvl2/temperature', privateId + ';' + temp);
}

function changeInterval() {
	if (interval) { clearInterval(interval); }
	interval = setInterval(() => {
		publishData();
	}, intervalDelay);
}

var client = mqtt.connect([
	{ host: process.env.MQTT_URL || 'http://doughnut.kent.ac.uk', port: process.env.MQTT_PORT || 1883 }
]);

client.on('connect', () => {
	client.subscribe('meditemp/gtvl2/settings');
	console.log("Simulator connected to MQTT Socket with id " + privateId);
	publishData();
	changeInterval();
});

client.on('message', (topic, message) => {
	switch (toic) {
		case 'meditemp/gtvl2/settings':
		var settings = JSON.parse(message.toString());
		intervalDelay = settings.delay;
		changeInterval();
		break;
		default:
		break;
	}
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
