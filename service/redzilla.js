
const axios = require('axios')
const config = require('./config')

module.exports = class Redzilla {

    url(id, op) {
        return `${config.redzilla.url}/v2/instances${id ? '/' + id : ''}${op ? '/' + op : ''}`
    }

    async list() {
        return await axios.get(this.url())
    }

    async get(id) {
        return await axios.get(this.url(id))
    }

    async start(id) {
        return await axios.put(this.url(id))
    }

    async stop(id) {
        return await axios.delete(this.url(id))
    }

    async create(id) {
        return await axios.post(this.url(id))
    }

    async delete(id) {
        return await axios.delete(this.url(id))
    }

}
