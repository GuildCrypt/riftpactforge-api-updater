const Web3HttpProvider = require('web3-providers-http')
const OathForgeProviderClient = require('oathforge-provider-client')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const amorphNumber = require('amorph-number')
const delay = require('delay')
const fs = require('fs')
const update = require('./lib/update')
const upload = require('./lib/upload')
const UpdateQueue = require('./lib/UpdateQueue')

const targetElapsed = 15000

start('mainnet', 'a307b905140c82b37f2d7d806ef9d8858d30ac87')
start('rinkeby', '8466730da0d53ceec0d1f564dd462713e676fca6')

function start(network, oathForgeAddressHexUnprefixed) {
  const mainnetProvider = new Web3HttpProvider(`https://${network}.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
  mainnetProvider.sendAsync = mainnetProvider.send

  const oathForgeAddress = Amorph.from(amorphHex.unprefixed, oathForgeAddressHexUnprefixed)
  const oathForgeProviderClient = new OathForgeProviderClient(mainnetProvider, oathForgeAddress)

  const updateQueue = new UpdateQueue(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient)

  oathForgeProviderClient.ultralightbeam.blockPoller.emitter.on('block', () => {
    updateQueue.queue()
  })
}
