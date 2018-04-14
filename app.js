var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var multer = require('multer');
var upload = multer({dest: './public/images/bittrex'});

var frame1h = require('./routes/frame1h');
var admin = require('./routes/admin');
var frame2h = require('./routes/frame2h');
var frame1d = require('./routes/frame1d');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
	secret: 'secret',
	saveIninitialized: true,
	resave: true
}));

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}
	return {
		param: formParam,
		msg: msg,
		value: value
	};
	}
}));

app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(flash());

app.use('/', frame1h);
app.use('/frame2h', frame2h);
app.use('/frame1d', frame1d);


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port: ' + app.get('port'));
});