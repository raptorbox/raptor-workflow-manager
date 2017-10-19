
const Promise = require("bluebird");
const Raptor = require("raptor-sdk")

const config = require("./config")
const raptor = new Raptor(config.raptor)

const cache = {}

module.exports = {
   type: "credentials",
   users: function(username) {
       return raptor.Auth().login()
       .then(()=> {
           if (!cache[username]) {
               return Promise.resolve(null)
           }
           return Promise.resolve(cache[username].user)
       })
       .catch((e) => {
           console.log("Err", e)
           return Promise.resolve(null)
       })
   },
   authenticate: function(username,password) {
       return raptor.Auth().login().then(()=> {
           const r = new Raptor({
               username, password,
               url: raptor.getConfig().url
           })
           return r.Auth().login()
            .then((user) => {
                cache[username] = {
                    raptor: r,
                    user: {
                        username,
                        permissions: '*'
                    }
                }
                return Promise.resolve(cache[username].user)
            })
            .catch((e) => {
                console.log("Err", e)
                return Promise.resolve(null)
            })
       })
   },
   default: function() {
       return Promise.resolve({anonymous: true, permissions:""})
   }
}
