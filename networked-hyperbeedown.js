const SDK = require('hyper-sdk')
const Hyperbee = require('hyperbee')
const HyperbeeDown = require('hyperbeedown')

module.exports = function makeNetworkedHypercore (opts = {}) {
  let { Hypercore, close } = opts

  async function _init () {
    if (!Hypercore) {
      const sdk = await SDK(opts)
      Hypercore = sdk.Hypercore
      close = sdk.close
    }
  }

  // TODO: DNS support
  return class NetworkedHyperbeedown extends HyperbeeDown {
    static close () {
      return close()
    }

    constructor (url) {
      super()
      this._url = url
    }

    async _open (_, cb) {
      try {
        await _init()
        const core = Hypercore(this._url)
        const tree = new Hyperbee(core)
        this.core = core
        this.tree = tree
        await this.tree.ready()
        cb()
      } catch (e) {
        cb(e)
      }
    }

    async getURL () {
      await this.tree.ready()
      return `hyper://${this.core.key.toString('hex')}/`
    }
  }
}
