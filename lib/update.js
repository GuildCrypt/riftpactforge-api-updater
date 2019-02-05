const amorphNumber = require('amorph-number')
const upload = require('./upload')

module.exports = function update(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient) {
  return oathForgeProviderClient.fetchOathForgeState().then((oathForgeState) => {
    const payload = {
      retrievedAt: Math.round((new Date).getTime() / 1000),
      blockNumber: oathForgeProviderClient.ultralightbeam.blockPoller.block.number.to(amorphNumber.unsigned),
      data: oathForgeState.toSimplePojo()
    }
    return upload(network, oathForgeAddressHexUnprefixed, payload).then(() => {
      return payload
    })
  })
}
