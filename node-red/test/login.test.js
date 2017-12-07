
const logger = require('winston')
const request = require('request-promise')
const cli = require('../raptor')

logger.level = 'debug'

const baseUrl = 'http://test1.workflow.localhost:1880/'

describe('node-red', function() {
    describe('login', function() {
        it('login with nonce', function() {
            return cli.generateToken('admin', 'admin').then((token) => request({
                method: 'GET',
                url: `${baseUrl}?nonce=${token.token}`
            }))
        })
    })
})
