# pouch-hyperbee

Testing out PouchDB with hyperbee for p2p database loading

**Warning: Still in WIP status**

## Example

```JavaScript
PouchDB.plugin(require('poouchdb-hyperbee'))

// You can pass any valid `hyper://` URL
// URLs with a `name` in them will generate a local hyperbee
// You can sparsely load remote DBs with a full `hyper://` URL
const pouch = new PouchDB('hyper://example', {
  adapter: 'hyperbee'
})

const url = await pouch.getURL()
```
