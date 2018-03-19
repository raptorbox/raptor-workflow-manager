
const assert = require('chai').assert
const util = require('./util')
const Redzilla = require('../redzilla')
// const logger = require('../logger')

describe('Redzilla API client', function () {

    before(util.before)
    after(util.after)

    it('should list all workflows', () => (new Redzilla()).list().then((res) => {
        assert.isTrue(res.data instanceof Array)
        return Promise.resolve()
    }))

    it('should create a workflow instance', async () => {
        const r = new Redzilla()
        const name = 'test' + Date.now()
        await r.create( name )
        const lst = await r.list()
        assert.equal(1, lst.data.filter((r) => name == r.Name).length)
        return Promise.resolve()
    })

})
