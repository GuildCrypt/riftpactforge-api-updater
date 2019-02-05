const update = require('./update')

module.exports = class Qr {
  constructor(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient) {
    this.network = network
    this.oathForgeAddressHexUnprefixed = oathForgeAddressHexUnprefixed
    this.oathForgeProviderClient = oathForgeProviderClient

    this.isUpdating = false
    this.isMissedBlock = false
    this.isQueud = false
  }
  queue() {
    if (this.isQueud) {
      return
    } else {
      this.updateAndLog()
    }
  }
  updateAndLog() {
    const startedAt = new Date
    this.isUpdating = true
    this.isQueud = false
    return update(this.network, this.oathForgeAddressHexUnprefixed, this.oathForgeProviderClient).then((payload) => {
      const finishedAt = new Date
      const elapsed = finishedAt - startedAt
      console.log(this.network, this.oathForgeAddressHexUnprefixed, payload.blockNumber, elapsed)
    }).finally(() => {
      this.isUpdating  = false
    })
  }
}
