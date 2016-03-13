(function(){
    
    var request = require("request");
    var qs      = require('querystring');
    var moment  = require("moment");
    var jwt     = require('jwt-simple');
    var User    = require("./user.model");
    
    function createJWT(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, process.env.TOKEN_SECRET);
    }
    
    module.exports.twitter = function(req, res) {
        console.log("twitter login");
        var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
        
        // Part 1 of 2: Initial request from Satellizer.
        if (!req.body.oauth_token || !req.body.oauth_verifier) {
            var requestTokenOauth = {
                consumer_key: process.env.TWITTER_KEY,
                consumer_secret: process.env.TWITTER_SECRET,
                callback: req.body.redirectUri
            };
            
            // Step 1. Obtain request token for the authorization popup.
            request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
                var oauthToken = qs.parse(body);

                // Step 2. Send OAuth token back to open the authorization screen.
                res.send(oauthToken);
            });
        } else {
            // Part 2 of 2: Second request after Authorize app is clicked.
            var accessTokenOauth = {
                consumer_key: process.env.TWITTER_KEY,
                consumer_secret: process.env.TWITTER_SECRET,
                token: req.body.oauth_token,
                verifier: req.body.oauth_verifier
            };
            
            // Step 3. Exchange oauth token and oauth verifier for access token.
            request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {
                accessToken = qs.parse(accessToken);
                var profileOauth = {
                    consumer_key: process.env.TWITTER_KEY,
                    consumer_secret: process.env.TWITTER_SECRET,
                    oauth_token: accessToken.oauth_token
                };

                // Step 4. Retrieve profile information about the current user.
                request.get({ url: profileUrl + accessToken.screen_name, oauth: profileOauth, json: true }, function(err, response, profile) {

                    // Step 5a. Link user accounts.
                    if (req.header('Authorization')) {
                        User.findOne({ twitter: profile.id }, function(err, existingUser) {
                            if (existingUser)  return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
                        
                            var token = req.header('Authorization').split(' ')[1];
                            var payload = jwt.decode(token, process.env.TOKEN_SECRET);

                            User.findById(payload.sub, function(err, user) {
                                if (!user) {
                                    return res.status(400).send({ message: 'User not found' });
                                }

                                user.twitter = profile.id;
                                user.name = user.name || profile.name;
                                user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
                                
                                user.save(function(err) {
                                    if (err) res.status(500).send(err);
                                    else res.json({ token: createJWT(user), user: user });
                                });
                            });
                        });
                    } else {
                        // Step 5b. Create a new user account or return an existing one.
                        User.findOne({ twitter: profile.id }, function(err, existingUser) {
                            if (existingUser) return res.json({ token: createJWT(existingUser), user: existingUser });
                            
                            var user = new User({
                                twitter: profile.id,
                                name: profile.name,
                                picture: profile.profile_image_url.replace('_normal', '')
                            });
                            user.save(function(err, doc) {
                                if (err) res.status(500).send(err);
                                else res.json({ token: createJWT(user), user: doc });
                            });
                        });
                    }
                });
            });
        }
    };
    
    module.exports.github = function(req, res) {
        console.log("github login");
        var accessTokenUrl = 'https://github.com/login/oauth/access_token';
        var userApiUrl = 'https://api.github.com/user';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: process.env.GITHUB_SECRET,
            redirect_uri: req.body.redirectUri
        };
            
        // Step 1. Exchange authorization code for access token.
        request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
            accessToken = qs.parse(accessToken);
            var headers = { 'User-Agent': 'Satellizer' };
            
            // Step 2a. Retrieve profile information about the current user.
            request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {
                
                // Step 2b. Get email
                request.get({ url: userApiUrl + "/emails", qs: accessToken, headers: headers, json: true }, function(err, response, emails) {
                    var useremail = emails.find(e => { return e.primary }).email;
                    
                    // Step 3a. Link user accounts.
                    if (req.header('Authorization')) {
                        User.findOne({ github: profile.id }, function(err, existingUser) {
                            if (existingUser) {
                                return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
                            }
                            var token = req.header('Authorization').split(' ')[1];
                            var payload = jwt.decode(token, process.env.TOKEN_SECRET);
                            User.findById(payload.sub, function(err, user) {
                                if (!user) {
                                    return res.status(400).send({ message: 'User not found' });
                                }
                                user.github = profile.id;
                                user.picture = user.picture || profile.avatar_url;
                                user.name = user.name || profile.name;
                                user.email = user.email || useremail;
                                user.save(function() {
                                    var token = createJWT(user);
                                    res.json({ token: token, user: user });
                                });
                            });
                        });
                    } else {
                        // Step 3b. Create a new user account or return an existing one.
                        User.findOne({ github: profile.id }, function(err, existingUser) {
                            if (existingUser) {
                                var token = createJWT(existingUser);
                                return res.json({ token: token, user: existingUser });
                            } else {
                                var user = new User({
                                    github: profile.id,
                                    name: profile.name,
                                    email: useremail,
                                    picture: profile.avatar_url
                                });
                                user.save(function() {
                                    var token = createJWT(user);
                                    res.json({ token: token, user: user });
                                });
                            }
                        });
                    }
                });
            });
        });
    };
    
}());
