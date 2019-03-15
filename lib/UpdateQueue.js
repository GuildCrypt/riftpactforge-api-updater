const update = require('./update')

module.exports = class UpdateQueue {
  constructor(network, riftpactforgeAddressHexUnprefixed, riftpactforgeProviderClient) {
    this.network = network
    this.riftpactforgeAddressHexUnprefixed = riftpactforgeAddressHexUnprefixed
    this.riftpactforgeProviderClient = riftpactforgeProviderClient

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
    return update(this.network, this.riftpactforgeAddressHexUnprefixed, this.riftpactforgeProviderClient).then((payload) => {
      const finishedAt = new Date
      const elapsed = finishedAt - startedAt
      console.log(this.network, this.riftpactforgeAddressHexUnprefixed, payload.blockNumber, elapsed)
    }).then(() => {
      this.isUpdating  = false
    })
  }
}
