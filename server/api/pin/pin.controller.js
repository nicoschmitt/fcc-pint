(function(){
    
    var Pin  = require('./pin.model');
    var User = require("../../auth/user.model");
    
    module.exports.recent = function(req, res) {
        Pin.find().sort({when: 'desc'}).limit(30).exec(function(err, pins) {
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
        Pin.findByIdAndRemove(req.params.pin, function(err, doc){
            if (err) return res.status(500).send(err);
            else return res.json({ status: "ok" });
        });
    };
    
}());
