

// init
require("node-red/red")

// const passport = require("passport")
// const TokenStrategy   = require('passport-token').Strategy;
// passport.use(new TokenStrategy(strategyOptions,
// 	function (username, token, done) {
// 		User.findOne({username: username}, function (err, user) {
// 			if (err) {
// 				return done(err);
// 			}
//
// 			if (!user) {
// 				return done(null, false);
// 			}
//
// 			if (!user.verifyToken(token)) {
// 				return done(null, false);
// 			}
//
// 			return done(null, user);
// 		});
// 	}
