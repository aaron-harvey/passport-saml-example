require('dotenv').config();

const os = require('os');
const express = require('express');
const https = require('https');
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const errorhandler = require('errorhandler');
const metadata = require('passport-saml-metadata').metadata;
const getSsl = require('./ssl');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const app = express();

app.set('port', config.app.port);
app.set('hostname', config.app.hostname);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'waezrsdxtgfhjgvhghcfgnhmgjh,kml,'
}));

require('./config/passport')(app, passport, config);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

metadata(app)(config.passport.saml);

require('./config/routes')(app, config, passport);

getSsl().then((cert) => {
  https.createServer(cert, app)
    .listen(app.get('port'), function () {
      console.log(`Accepting requests at https://${app.get('hostname')}:${app.get('port')}`);
    });
});
