
const assert = require('chai').assert
const util = require('./util')
const Redzilla = require('../redzilla')
// const logger = require('../logger')

const instanceName = 'workflow_test' + Math.floor(Date.now() * Math.random())

describe('Redzilla API client', function () {

    before(util.before)
    after(util.after)

    // spawing node-red containers can take a while
    this.timeout(15000)

    it('should list all workflows', () => (new Redzilla()).list().then((res) => {
        assert.isTrue(res.data instanceof Array)
        return Promise.resolve()
    }))

    it('should create a workflow instance', async () => {
        const r = new Redzilla()
        await r.create( instanceName )
        const lst = await r.list()
        assert.equal(1, lst.data.filter((r) => instanceName == r.Name).length)
        return r.delete(instanceName)
    })

})
