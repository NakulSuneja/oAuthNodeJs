var User = require('../models/user');

var userController = {getUsers : function(req,res) {
	User.find({},function(err,users){
      if(err){
      	res.send(err);
      }
      res.send(users);
	})
   },

    addUser : function(req,res) {
	var user = new User(req.body);
	
	user.save(user,function(err){
		if(err)
			res.send(err);

		res.json('User added');
	});
}
}	

module.exports = userController;
