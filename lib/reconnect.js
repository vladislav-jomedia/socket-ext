'use strict'
function ReConnect(inject,options, callback) {
  if (!options.port) throw new Error('Port is a required option');
  const port = options.port;
  const host = options.host || 'localhost';
  const reconnect = options.reconnect || true;
  const reconnectDelay = options.reconnectDelay || 10000;
  const logger = options.logger || console
  const debug = options.debug || false
  const failBack = options.failBack || false
  const failBackDir = options.failBackDir || '/tmp'
  const failBackPrefix = options.failBackPrefix || 'Socket'

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
    if(debug) logger.info('Socket object structure:\n',JSON.stringify(socket,null,4))

    socket.removeListener('error', handleReconnect);
    socket.removeListener('close', handleReconnect);

    callback(null, socket);
    socket.on('close', handleReconnect);
  });
  socket.on('error', handleReconnect);
}

module.exports.ReConnect = ReConnect;
