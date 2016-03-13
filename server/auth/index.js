(function(){
    
    var express = require('express');
    var router = express.Router();
    
    var controller = require('./auth.controller');
  
    router.post('/github', controller.github);
    router.post('/twitter', controller.twitter);

    module.exports = router;
    
}());
