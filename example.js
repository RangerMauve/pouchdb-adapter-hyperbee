const PouchDB = require('pouchdb')

const PouchHyperbeePlugin = require('./')({ persist: false })

PouchDB.plugin(PouchHyperbeePlugin)

run()

async function run () {
  try {
    const pouch = new PouchDB('hyper://example', { adapter: 'hyperbee' })
    const doc = await pouch.post({ message: 'Hello World' })

    console.log(doc)

    const url = await pouch.getURL()

    console.log({url})
  } catch (e) {
    console.error(e.stack)
  } finally {
    await PouchHyperbeePlugin.close()
  }
}
