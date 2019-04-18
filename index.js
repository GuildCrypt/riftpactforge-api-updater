const Web3HttpProvider = require('web3-providers-http')
const RiftpactforgeProviderClient = require('riftpactforge-provider-client')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const amorphNumber = require('amorph-number')
const delay = require('delay')
const fs = require('fs')
const update = require('./lib/update')
const upload = require('./lib/upload')
const UpdateQueue = require('./lib/UpdateQueue')

const targetElapsed = 15000

start('mainnet', '6e87624b3bc434cd708c2ca517541ddc89c7d5b3')
start('rinkeby', 'd7b4a7d2bb0ffa29a7d2f17cd6b7e176c48060a6')

function start(network, riftpactforgeAddressHexUnprefixed) {
  const mainnetProvider = new Web3HttpProvider(`https://${network}.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
  mainnetProvider.sendAsync = mainnetProvider.send

  const riftpactforgeAddress = Amorph.from(amorphHex.unprefixed, riftpactforgeAddressHexUnprefixed)
  const riftpactforgeProviderClient = new RiftpactforgeProviderClient(mainnetProvider, riftpactforgeAddress)

  const updateQueue = new UpdateQueue(network, riftpactforgeAddressHexUnprefixed, riftpactforgeProviderClient)

  riftpactforgeProviderClient.ultralightbeam.blockPoller.emitter.on('block', () => {
    updateQueue.queue()
  })
}
