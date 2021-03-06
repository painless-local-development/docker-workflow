var express = require('express')
var http = require('http')
var redis = require('redis')

var whoami = 'microservice-' + parseInt(Math.random()*1000000000)

// PUB_SUB BUS //////////////////////////////////////////////////////////////////////
console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT)

// APPROACH 1: Using environment variables created by Docker
// var client = redis.createClient(
// 	process.env.REDIS_PORT_6379_TCP_PORT,
//   	process.env.REDIS_PORT_6379_TCP_ADDR
// );

// APPROACH 2: Using host entries created by Docker in /etc/hosts (RECOMMENDED)
const client = redis.createClient('6379', 'redis')

// Self register


client.on("message", function (channel, message) {

  // var data = JSON.parse(message)
  // TODO: It's my turn?
  console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
})

client.subscribe("bus")

/*

// TODO investigate an alternative to implement RoundRobin of messages from bus
client.publish("system", JSON.stringify({code: "HELLO", id: whoami }))
process.on('exit', function () {
  client.publish("system", JSON.stringify({code: "BYE", id: whoami }))
});
*/
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
