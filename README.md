# pouchdb-adapter-hyperbee

Adapter for PouchDB to load p2p data from Hyperbee

## Example

```JavaScript
PouchDB.plugin(require('poouchdb-adapter-hyperbee')())

// You can pass any valid `hyper://` URL
// URLs with a `name` in them will generate a local hyperbee
// You can sparsely load remote DBs with a full `hyper://` URL
const pouch = new PouchDB('hyper://example', {
  adapter: 'hyperbee'
})

const url = await pouch.getURL()

// In case you want to access the hyperbee instance directly
const bee = pouch.bee
```
