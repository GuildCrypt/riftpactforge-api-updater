const restify = require('restify')
const fs = require('fs')
const cachePath = require('./lib/cachePath')

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/v0/ethereum/mainnet/a307b905140c82b37f2d7d806ef9d8858d30ac87', function (req, res, next) {
  fs.readFile(cachePath, 'utf8', (error, cacheJson) => {
    const cache = JSON.parse(cacheJson)
    res.send(JSON.parse(cacheJson))
    return next()
  })
})

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
