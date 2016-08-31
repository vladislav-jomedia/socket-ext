'use strict'

var fs = require('fs');
var net = require('tls');
var RRSocket = require('reqrepable-socket');

var options = {
  key: fs.readFileSync('Key.key'),
  cert: fs.readFileSync('Cert.pem')
};


function connection(sock){
    var socket = RRSocket(sock);

    socket.rep('auth', function(type, key, reply){
        console.log(type, key);
        reply('Accepted');
    });

    socket.rep('message', function(time, msg, reply){
        console.log(time, msg);
        reply('OK');
    });

    setTimeout(function(){
        socket.req('disconnect', function(answer){
            console.log(answer);
        });
    },10000)
};

var server = net.createServer(options,connection);
server.listen(3000);

server.on('error',function(err){
	console.log(err)
})
