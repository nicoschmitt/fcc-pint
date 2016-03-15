(function(){
    
    var express = require('express');
    var router = express.Router();
    var ensureAuthenticated = require("../../auth/auth.utils").ensureAuthenticated;

    var controller = require('./pin.controller');
  
    router.get('/', controller.recent);
    router.get('/:userid', controller.userwall);
    router.post('/', ensureAuthenticated, controller.create);
    router.delete('/:pin', ensureAuthenticated, controller.remove);

    module.exports = router;
    
}());
