var express = require('express')
var http = require('http')
var redis = require('redis')

// PUB_SUB BUS //////////////////////////////////////////////////////////////////////
console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT)

// APPROACH 1: Using environment variables created by Docker
// var client = redis.createClient(
// 	process.env.REDIS_PORT_6379_TCP_PORT,
//   	process.env.REDIS_PORT_6379_TCP_ADDR
// );

// APPROACH 2: Using host entries created by Docker in /etc/hosts (RECOMMENDED)
const client = redis.createClient('6379', 'redis')

setInterval(function () {
  var sample = { id: Math.random(), date: new Date().toISOString() }
  client.publish("bus", JSON.stringify(sample))
}, 3000)

// REST SERVICE /////////////////////////////////////////////////////////////////////

const app = express()

app.get('/', function (req, res, next) {
  client.incr('counter', function (err, counter) {
    if(err) {
      return next(err);
    }
    res.send('This page has been viewed ' + counter + ' times!')
  })
})

http
  .createServer(app)
  .listen(
    process.env.PORT || 8080,
    function () { console.log('Listening on port ' + (process.env.PORT || 8080)) })
