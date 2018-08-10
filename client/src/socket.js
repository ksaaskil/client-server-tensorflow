const io = require('socket.io-client');

export function initializeSocket({
  onConnect,
  onDataPoint,
  onDisconnect,
  onError
}) {
  const socket = io.connect('http://localhost:3000', { forceNew: true });

  socket.on('connect', onConnect);

  socket.on('error', onError);

  socket.on('disconnect', () => {
    onDisconnect();
    socket.close();
  });

  socket.on('data point', onDataPoint);
}
