const amorphNumber = require('amorph-number')
const upload = require('./upload')

module.exports = function update(network, riftpactforgeAddressHexUnprefixed, riftpactforgeProviderClient) {
  return riftpactforgeProviderClient.fetchRiftpactforgeState().then((riftpactforgeState) => {
    const payload = {
      retrievedAt: Math.round((new Date).getTime() / 1000),
      blockNumber: riftpactforgeProviderClient.ultralightbeam.blockPoller.block.number.to(amorphNumber.unsigned),
      data: riftpactforgeState.toSimplePojo()
    }
    return upload(network, riftpactforgeAddressHexUnprefixed, payload).then(() => {
      return payload
    })
  })
}
