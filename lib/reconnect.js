'use strict'
function ReConnect(inject,options, callback) {
  if (!options.port) throw new Error('Port is a required option');
  var port = options.port;
  var host = options.host || 'localhost';
  var reconnect = options.reconnect || true;
  var reconnectDelay = options.reconnectDelay || 10000;
  var logger = options.logger || console
  var debug = options.debug || false
  var failBack = options.failBack || false
  var failBackDir = options.failBackDir || '/tmp'
  var failBackPrefix = options.failBackPrefix || 'Socket'

  logger.info('Attempting to open socket', port, host);
  if(debug) logger.info('Options:\n',options)

  function handleReconnect(err) {
      logger.info(err)
      logger.info('Trying to reconnect, next try in',reconnectDelay);

      setTimeout(function(){

          ReConnect(inject,options,callback)

      },reconnectDelay);
  }

  var socket = inject.connect(options, function(){
    logger.info('Socket is connected', port, host);
    if(debug) logger.info('Socket object structure:\n',socket)

    socket.removeListener('error', handleReconnect);
    socket.removeListener('close', handleReconnect);

    callback(null, socket);
    socket.on('close', handleReconnect);
  });
  socket.on('error', handleReconnect);
}

module.exports.ReConnect = ReConnect;
