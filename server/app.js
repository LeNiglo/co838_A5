var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');

var app = express();

var db = require('monkii')(process.env.MONGO_URL || 'localhost:27017/co838_a5');

var mqttClient = require('./mqtt')(db);

// view engine setup
var hbs = require('express-handlebars').create({
	extname: 'hbs',
	layoutsDir: 'views/layouts/',
	defaultLayout: 'main.hbs',
	partialsDir: 'views/partials/',
	helpers: {
		dateFormat: (date) => {
			return moment(date).format('lll');
		},
		fromNow: (date) => {
			return moment(date).fromNow();
		},
		getTime: (date) => {
			return new Date(date).getTime();
		},
		ifMqttConnected: (block) => {
			if (mqttClient.isConnected) {
				return block.fn(this);
			} else {
				return block.inverse(this);
			}
		}
	}
});
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

var backgroundCheck = undefined;
if (process.env.MAILER_USERNAME && process.env.MAILER_HOST) {
	require('express-mailer').extend(app, {
		from: 'MediTemp <medi.temp@host.local>',
		host: process.env.MAILER_HOST,
		secureConnection: false,
		port: process.env.MAILER_PORT,
		transportMethod: 'SMTP',
		auth: {
			user: process.env.MAILER_USERNAME,
			pass: process.env.MAILER_PASSWORD
		}
	});

	backgroundCheck = require('./background')(app, db);
	// backgroundCheck.checkProducts();
}

app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.ico')));
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
	req.db = db;
	next();
});

app.use('/', require('./routes/index'));
app.use('/products', require('./routes/products'));
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		console.error(err);
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
