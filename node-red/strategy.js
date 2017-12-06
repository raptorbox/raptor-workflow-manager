
const passport = require('passport')
const CustomStrategy = require('passport-custom')
const nonce = require('./nonce')
//
// passport.use('nonce', new CustomStrategy(nonce.strategy))
//
const StrategyWrap = function(opts, done) {
    console.warn('StrategyWrap')
}

module.exports = {
    type:'strategy',
    strategy: {
        name: 'nonce',
        label: 'Sign in with nonce',
        icon:'fa-twitter',
        strategy: StrategyWrap,
        options: {
        },
        verify: function(token, tokenSecret, profile, done) {
            console.warn('verify ....')
            done(null, profile)
        }
    },
    users: [
        { username: 'admin',permissions: ['*']}
    ]
}
