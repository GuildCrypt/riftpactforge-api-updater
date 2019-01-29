const Web3HttpProvider = require('web3-providers-http')
const OathForgeProviderClient = require('oathforge-provider-client')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const fs = require('fs-extra')
const cachePath = require('./lib/cachePath')
const delay = require('delay')

const mainnetProvider = new Web3HttpProvider(`https://mainnet.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
mainnetProvider.sendAsync = mainnetProvider.send

const oathForgeAddress = Amorph.from(amorphHex.unprefixed, 'a307b905140c82b37f2d7d806ef9d8858d30ac87')
const oathForgeProviderClient = new OathForgeProviderClient(mainnetProvider, oathForgeAddress)

function cache() {
  return oathForgeProviderClient.fetchOathForgeState().then((oathForgeState) => {
    const cache = {
      retrievedAt: Math.round((new Date).getTime() / 1000),
      data: oathForgeState.toSimplePojo()
    }
    return fs.writeFile(cachePath, JSON.stringify(cache), 'utf8')
  })
}

const targetElapsed = 15000

function loopCache() {
  const startedAt = new Date
  return cache().then(() => {
    const finishedAt = new Date
    const elapsed = finishedAt - startedAt
    console.log(startedAt, finishedAt, elapsed)
    if (elapsed < targetElapsed) {
      return delay(targetElapsed - elapsed)
    } else {
      return delay(0)
    }
  }).then(() => {
    return loopCache()
  })
}

loopCache()
