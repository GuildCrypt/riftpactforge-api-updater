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

//start('mainnet', 'a307b905140c82b37f2d7d806ef9d8858d30ac87')
start('rinkeby', '4b7fbe965081f1f5626e2662f2bbb352969ed14e')

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
