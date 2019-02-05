const aws = require('aws-sdk')
const fs = require('fs')

const secretAccessKey = process.env.AWS_SECRET || fs.readFileSync(`${__dirname}/../secrets/aws.txt`, 'utf8').trim()

aws.config.update({
    secretAccessKey,
    accessKeyId: "AKIAIZBQLTISIBWWR3TA",
    region: 'us-east-1'
})

const s3 = new aws.S3()

module.exports = function upload(network, oathForgeAddressHexUnprefixed, payload) {
  return s3.upload({
    Bucket: 'oathforge-api',
    ContentType: "application/json",
    Key: `v0/${network}/${oathForgeAddressHexUnprefixed}`,
    Body: JSON.stringify(payload, null, 2)
  }).promise()
}
