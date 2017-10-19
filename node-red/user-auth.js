
const Promise = require("bluebird");
const Raptor = require("raptor-sdk")

const config = require("./config")

const raptor = new Raptor(config)



module.exports = {
   type: "credentials",
   users: function(username) {
       return raptor.Auth().login()
       .then(()=> {
           return Promise.resolve()
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
                console.warn(user);
                return Promise.resolve({
                    username,
                    permissions: '*'
                })
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
