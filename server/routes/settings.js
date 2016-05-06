var express = require('express');
var _ = require('underscore');
var router = express.Router();

/**
*	GET settings page.
*/
router.get('/', (req, res, next) => {

	var settings = {
		adminEmail: req.app.get('adminEmail'),
		delay: req.app.get('deviceDelay')
	};

	res.render('settings', { settings: settings });
});

/**
*	POST change settings.
*/
router.post('/', (req, res, next) => {
	req.app.set('adminEmail', req.body.adminEmail);
	if (req.app.get('deviceDelay') != parseInt(req.body.delay)) {
		req.app.set('deviceDelay', parseInt(req.body.delay));
		req.app.get('mqttClient').publish('meditemp/gtvl2/settings', JSON.stringify({ settings: { delay: req.app.get('deviceDelay') } }));
	}
	res.redirect('/settings');
});

module.exports = router;
