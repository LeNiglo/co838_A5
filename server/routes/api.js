var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	req.db.get('temp_readings').find({}, {sort: {createdAt: 1}}, (error, results) => {
		res.json(results);
	});
});

router.get('/device/:deviceId', (req, res) => {
	req.db.get('devices').findOne({deviceId: req.params.deviceId}).success((doc) => {
		req.db.get('temp_readings').find({deviceId: req.params.deviceId}, {sort: {createdAt: 1}}, (error, results) => {
			doc.readings = results;
			res.json(doc);
		});
	});
});

module.exports = router;
