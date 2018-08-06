var oauth2orize = require('oauth2orize');
User = require('../models/user'),
Client = require('../models/client'),
Token = require('../models/token'),
Code = require('../models/code');

var server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
	return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
	Client.findOne({_id:id}, function(err, client) {
		if(err)
			return callback(err);

		return callback(null, client);
	});
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback){
	var code = new Code({
		value: uid(16),
		clientId: client._id,
		redirectUri: redirectUri,
		userId: user._id
	});

	console.log(code.value);

	code.save(function(err) {
		if(err)
			return callback(err);

		callback(null, code.value);
	});
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback){
	Code.findOne({value: code}, function(err, authCode) {
		console.log(authCode);
		if(err)
			return callback(err);

		if(authCode===undefined)
			return callback(null,false);

		if(client._id.toString()!==authCode.clientId)
			return callback(null,false);

		if(redirectUri!==authCode.redirectUri)
			return callback(null,false);


		authCode.remove(function(err){
			if(err) callback(err);

		var token = new Token({
			value: uid(256),
			clientId: authCode.clientId,
			userId: authCode.userId
		});

		token.save(function(err){
			if(err) callback(err);

			callback(null, token);
		});
	  });	
	});
}));

exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback){
  	Client.findOne({id:clientId}, function(err,client){
  		console.log('client:::',client);
  		if(err) callback(err);

  		return callback(null, client, redirectUri);
  	});
  }),
  function(req, res){
  	console.log(req);
  	res.render('dialog',{transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client});
  }
]

exports.decision = [
  server.decision()
]

exports.token = [
  server.token(),
  server.errorHandler()
]

function uid(len) {
	var buf =[];
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charlen = chars.length;

	for(var i=0;i<len;i++){
		buf.push(chars[getRandomInt(0,charlen-1)]);
	}  

	console.log(buf);  

	return buf.join('');
};

function getRandomInt(min,max){
	return Math.floor(Math.random()*(max-min+1))+min;
}