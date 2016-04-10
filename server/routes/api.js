var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	req.db.get('temp_readings').find({}, {sort: {createdAt: 1}}, (error, results) => {
		res.end(JSON.stringify(results));
	});
});

router.get('/device/:deviceId', (req, res) => {
	req.db.get('temp_readings').find({deviceId: req.params.deviceId}, {sort: {createdAt: 1}}, (error, results) => {
		res.end(JSON.stringify(results));
	});
});

module.exports = router;
