var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	Username:{
		type: String,
		required: true
	},
	Password:{
		type: String,
		required: true
	}
});

UserSchema.pre('save',function(cb){
	var user = this;

	if(!user.isModified('Password'))
		return cb();

    bcrypt.genSalt(5, function(err, salt){
    	if(err)
    		return cb(err);

    	bcrypt.hash(user.Password, salt, null, function(err, hash){
    		if(err)
    			cb(err);
    		user.Password = hash;
    		cb();
    	})
    })
})

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.Password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Users',UserSchema);