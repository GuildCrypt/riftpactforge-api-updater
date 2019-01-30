const Web3HttpProvider = require('web3-providers-http')
const OathForgeProviderClient = require('oathforge-provider-client')
const Amorph = require('amorph')
const amorphHex = require('amorph-hex')
const delay = require('delay')
const fs = require('fs')
const aws = require('aws-sdk')

const secretAccessKey = fs.readFileSync('./secrets/aws.txt', 'utf8').trim()

aws.config.update({
    secretAccessKey,
    accessKeyId: "AKIAIZBQLTISIBWWR3TA",
    region: 'us-east-1'
})

const s3 = new aws.S3()

const mainnetProvider = new Web3HttpProvider(`https://mainnet.infura.io/v3/ddf5fd9bc2314199814e9398df57f486`)
mainnetProvider.sendAsync = mainnetProvider.send

const oathForgeAddress = Amorph.from(amorphHex.unprefixed, 'a307b905140c82b37f2d7d806ef9d8858d30ac87')
const oathForgeProviderClient = new OathForgeProviderClient(mainnetProvider, oathForgeAddress)

function update() {
  return oathForgeProviderClient.fetchOathForgeState().then((oathForgeState) => {
    const payload = {
      retrievedAt: Math.round((new Date).getTime() / 1000),
      data: oathForgeState.toSimplePojo()
    }
    return s3.upload({
      Bucket: 'oathforge-api',
      ContentType: "application/json",
      Key: 'v0/mainnet/a307b905140c82b37f2d7d806ef9d8858d30ac87',
      Body: JSON.stringify(payload)
    }).promise()
  })
}

const targetElapsed = 15000

function loopUpdate() {
  const startedAt = new Date
  return update().then(() => {
    const finishedAt = new Date
    const elapsed = finishedAt - startedAt
    console.log(startedAt, finishedAt, elapsed)
    if (elapsed < targetElapsed) {
      return delay(targetElapsed - elapsed)
    } else {
      return delay(0)
    }
  }).then(() => {
    return loopUpdate()
  })
}

loopUpdate()
