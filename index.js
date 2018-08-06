var express = require('express'),
ejs = require('ejs'),
session = require('express-session'),
User_Controller = require('./controllers/user'),
Client_Controller = require('./controllers/client');
Auth_Controller = require('./controllers/auth'),
oauth2Controller = require('./controllers/oauth2');
app = express(),
port = 3000;

var mongoose = require('mongoose'),
bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/oauth');

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret:'Super Secret Session Key',
	saveUninitialized:true,
	resave:true
}));

app.route('/users').get(User_Controller.getUsers);
app.route('/users').post(User_Controller.addUser);

app.route('/clients').get(Auth_Controller.isAuthenticated,Client_Controller.getClients);
app.route('/clients').post(Auth_Controller.isAuthenticated,Client_Controller.postClients);

app.route('/oauth2/authorize').get(Auth_Controller.isAuthenticated,oauth2Controller.authorization);
app.route('/oauth2/authorize').post(Auth_Controller.isAuthenticated,oauth2Controller.decision);
app.route('/oauth2/token').post(Auth_Controller.isClientAuthenticated, oauth2Controller.token);

app.listen(port);

console.log('Server listening on port -', port);
