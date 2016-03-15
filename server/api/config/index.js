(function(){
    
    var Pin  = require('../pin/pin.model');
    var shortid = require("shortid");
    
    var express = require('express');
    var router = express.Router();
    
    var getConfig = function(req, res) {
      res.json({ 
          githubAppId: process.env.GITHUB_CLIENT_ID
      });
    };
    
    var populate = function(req, res) {
        var url = "https://unsplash.it/200/300/?random&seed=";
        
        Pin.remove({ author: "system" }, function() {});
        
        var nb = 20;
        for (var i = 0; i < nb; i++) {
            var pin = new Pin({ title: "sample", url: url + shortid.generate(), createdBy: "null", author: "system" });
            pin.save(function(err, doc){});
        }
        
        res.send("ok. " + nb + " images created.");
    }
    
    router.get("/populate", populate);
    router.get('/', getConfig);
    
    module.exports = router;
    
}());
