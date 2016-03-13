(function(){
    
    var register = function(app) {
        app.use('/api/config', require('./api/config'));
        app.use('/auth', require('./auth'));
        app.use('/api/pin', require('./api/pin'));
        // app.use('/api/book', require('./api/book'));
        // app.use('/api/trade', require('./api/trade'));
        // app.use('/api/search', require('./api/search'));
    };

    module.exports.register = register;

}());
