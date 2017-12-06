
const assert = require('assert')
const Raptor = require('raptor-sdk')
const logger = require('winston')
const request = require('request-promise')
const config = require('./config')

const client = () => {
    const r = new Raptor(config.raptor)
    return r.Auth().login()
        .then(() => Promise.resolve(r))
}

module.exports = { client }
