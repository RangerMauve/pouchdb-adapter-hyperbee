// Loosely based on pouchdb-adapter-memory
const CoreLevelPouch = require('pouchdb-adapter-leveldb-core')
const makeNetworkedHyperbeedown = require('networked-hyperbeedown')

module.exports = function makeHyperbeePouchPlugin (opts) {
  const NetworkedHyperbeedown = makeNetworkedHyperbeedown(opts)

  function HyperbeePouch (opts, callback) {
    const db = (url) => {
      const _db = new NetworkedHyperbeedown(url)
      if(this.__db) throw new Error('Something went wrong, the hyperbee adapter only supports loading a single instance at a time')
      this.__db = _db
      return _db
    }

    const _opts = {
      db,
      ...opts
    }
    CoreLevelPouch.call(this, _opts, callback)
  }

  HyperbeePouch.valid = () => true

  /* eslint-disable camelcase */
  HyperbeePouch.use_prefix = false

  function attachHyperbeePouch (PouchDB) {
    PouchDB.adapter(
      'hyperbee',
      HyperbeePouch,
      true
    )
    PouchDB.plugin({
      getURL () {
        return this.__db.getURL()
      }
    })
  }

  attachHyperbeePouch.close = (...opts) => NetworkedHyperbeedown.close(...opts)

  return attachHyperbeePouch
}
