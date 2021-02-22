// Loosely based on pouchdb-adapter-memory
const CoreLevelPouch = orDefault(require('pouchdb-adapter-leveldb-core'))
const makeNetworkedHyperbeedown = require('networked-hyperbeedown')

module.exports = function makeHyperbeePouchPlugin (opts) {
  const NetworkedHyperbeedown = makeNetworkedHyperbeedown(opts)

  function HyperbeePouch (opts, callback) {
    const db = (url) => {
      const _db = new NetworkedHyperbeedown(url, {
        // Seems like pouch uses these encodings to work
        keyEncoding: 'utf-8',
        valueEncoding: 'binary'
      })
      if (this.__db) throw new Error('Something went wrong, the hyperbee adapter only supports loading a single instance at a time')
      this.__db = _db
      _db.open((err) => {
        this.emit(err ? 'error' : 'open', err)
      })
      return _db
    }

    const _opts = {
      db,
      ...opts
    }
    CoreLevelPouch.call(this, _opts, callback)

    Object.defineProperty(this, 'bee', {
      get: () => this.__db.tree
    })
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

// This is necessary to account for Webpack environments
// Pouch exports ESM when possible, and Webpack doesn't normalize it back
function orDefault(module) {
  if (module.default) return module.default;
  return module;
}
