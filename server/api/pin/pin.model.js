(function(){
    
    var mongoose = require('mongoose');
    var shortid = require("shortid");
    
    var Pin = mongoose.model("Pin", new mongoose.Schema({ 
        _id: {
            type: String,
            unique: true,
            'default': shortid.generate
        },
        title: String,
        url: String,
        createdBy: { type: String, ref: "User" },
        author: String,
        when: { type: Date, default: Date.now }
    }));
        
    module.exports = Pin;
    
}());
