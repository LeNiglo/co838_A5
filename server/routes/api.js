var express = require('express');
var router = express.Router();

/**
*	API Endpoint that returns raw temperature readings in JSON
*/
router.get('/', (req, res) => {
	req.db.get('temp_readings').find({}, {sort: {createdAt: 1}}, (error, results) => {
		res.json(results);
	});
});

/**
*	API Endpoint that returns information specific to a device
*/
router.get('/device/:deviceId', (req, res) => {
	req.db.get('devices').findOne({deviceId: req.params.deviceId}).success((doc) => {
		req.db.get('temp_readings').find({deviceId: req.params.deviceId}, {sort: {createdAt: 1}}, (error, results) => {
			doc.readings = results;
			res.json(doc);
		});
	});
});

module.exports = router;
