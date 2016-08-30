'use strict'

var fs = require('fs');
var net = require('tls');
var RRSocket = require('reqrepable-socket');
var reconnect = require('../index.js').ReConnect

var options = {
  port: 3000,
  host: 'ta.infra.systems',
  key: fs.readFileSync('Key.key'),
  cert: fs.readFileSync('Cert.pem'),
  rejectUnauthorized: true,
  reconnectDelay: 1000
};


reconnect(net,options, function(err, sock) {
    var socket = RRSocket(sock);

    socket.rep('disconnect', function(msg, reply){
        console.log('Disconnect');
        socket.end()
    });

    socket.req('auth', 'pass', 'Mystrongpass', function(answer){
        console.log(answer);
    });

    socket.req('message', '739872698276', 'sljhalkjdfhlakjdfhlkasjfhlskajfhlksajfhla', function(answer){
        console.log(answer);
    });


    socket.on('close', function(err){
        console.log('OUSIDE',err)
    });
    socket.on('error', function(err){
        console.log('OUSIDE err',err)
    });

})
