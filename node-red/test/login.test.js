
const assert = require('assert')
const Raptor = require('raptor-sdk')
const logger = require('winston')
const request = require('request-promise')

logger.level = 'debug'

const baseUrl = 'http://test1.workflow.localhost:1880'

const client = () => {
    return require('../raptor').client()
}

describe('node-red', function() {
    describe('login', function() {
        it('login with nonce', function() {
            return client().then((r) => {
                return r.Admin().Token().create({
                    name: 'nonce',
                    expires: (Date.now() + 2000000) / 1000,
                }).then((token) => {
                    console.log(`${baseUrl}?nonce=${token.token}`)
                    // return request({
                    //     method: 'GET',
                    //     url: `${baseUrl}?nonce=${token.token}`
                    // })
                    return Promise.resolve()
                })

            })
        })
    })
})
