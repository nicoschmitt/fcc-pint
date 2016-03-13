(function(){
    
    var mongoose = require('mongoose');
    var shortid = require("shortid");

    var User = mongoose.model("User", new mongoose.Schema({ 
        _id: {
            type: String,
            unique: true,
            'default': shortid.generate
        },
        name: String,
        email: String,
        github: String,
        twitter: String
    }));
        
    module.exports = User;
    
}());
