const Web3HttpProvider = require('web3-providers-http')
const OathForgeProviderClient = require('oathforge-provider-client')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const delay = require('delay')
const fs = require('fs')
const aws = require('aws-sdk')
const amorphNumber = require('amorph-number')

const secretAccessKey = process.env.AWS_SECRET || fs.readFileSync('./secrets/aws.txt', 'utf8').trim()

aws.config.update({
    secretAccessKey,
    accessKeyId: "AKIAIZBQLTISIBWWR3TA",
    region: 'us-east-1'
})

const s3 = new aws.S3()
const targetElapsed = 15000

startLoopUpdate('mainnet', 'a307b905140c82b37f2d7d806ef9d8858d30ac87')
setTimeout(() => {
  startLoopUpdate('rinkeby', '8466730da0d53ceec0d1f564dd462713e676fca6')
}, targetElapsed / 2)

function upload(network, oathForgeAddressHexUnprefixed, payload) {
  return s3.upload({
    Bucket: 'oathforge-api',
    ContentType: "application/json",
    Key: `v0/${network}/${oathForgeAddressHexUnprefixed}`,
    Body: JSON.stringify(payload, null, 2)
  }).promise()
}

function update(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient) {
  return oathForgeProviderClient.fetchOathForgeState().then((oathForgeState) => {
    const payload = {
      retrievedAt: Math.round((new Date).getTime() / 1000),
      blockNumber: oathForgeProviderClient.ultralightbeam.blockPoller.block.number.to(amorphNumber.unsigned),
      data: oathForgeState.toSimplePojo()
    }
    return upload(network, oathForgeAddressHexUnprefixed, payload)
  })
}

function loopUpdate(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient) {
  const startedAt = new Date
  return update(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient).then(() => {
    const finishedAt = new Date
    const elapsed = finishedAt - startedAt
    console.log(network, oathForgeAddressHexUnprefixed, startedAt, finishedAt, elapsed)
    if (elapsed < targetElapsed) {
      return delay(targetElapsed - elapsed)
    } else {
      return delay(0)
    }
  }).then(() => {
    return loopUpdate(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient)
  })
}

function startLoopUpdate(network, oathForgeAddressHexUnprefixed) {
  const mainnetProvider = new Web3HttpProvider(`https://${network}.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
  mainnetProvider.sendAsync = mainnetProvider.send

  const oathForgeAddress = Amorph.from(amorphHex.unprefixed, oathForgeAddressHexUnprefixed)
  const oathForgeProviderClient = new OathForgeProviderClient(mainnetProvider, oathForgeAddress)

  loopUpdate(network, oathForgeAddressHexUnprefixed, oathForgeProviderClient)

}
