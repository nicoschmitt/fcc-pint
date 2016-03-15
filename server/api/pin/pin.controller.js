(function(){
    
    var Pin  = require('./pin.model');
    var User = require("../../auth/user.model");
    
    var maxWall = 30;
    
    module.exports.recent = function(req, res) {
        Pin.find().sort({when: 'desc'}).limit(maxWall).exec(function(err, pins) {
            if (err) res.status(500).send(err);
            else res.json(pins);
        });
    };
    
    module.exports.userwall = function(req, res) {
        console.log("Wall for user " + req.params.userid);
        Pin.find({ createdBy: req.params.userid }).sort({when: 'desc'}).limit(maxWall).exec(function(err, pins) {
            if (err) res.status(500).send(err);
            else res.json(pins);
        });
    };
    
    module.exports.create = function(req, res) {
        console.log("Create pin");
        
        User.findById(req.user, function(err, user) {
            var pin = new Pin({ title: req.body.title, url: req.body.url, createdBy: req.user, author: user.name });
            pin.save(function(err, doc){
                if (err) res.status(500).send(err);
                else res.json(doc);
            });
        });
    };
    
    module.exports.remove = function(req, res) {
        Pin.findById(req.params.pin, function(err, pin){
            if (err) return res.status(500).send(err);
            
            if (pin.createdBy == req.user) {
                pin.remove(function(err, doc) {
                    if (err) return res.status(500).send(err);
                    else return res.json({ status: "ok" });
                });
            } else {
                return res.send(401).send("unauthorized");
            }
        });
    };
    
}());
