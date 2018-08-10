const randomNormal = require('random-normal');
const server = require('http').createServer();
const io = require('socket.io')(server);

const handleMessage = (clientId, message) => {
  console.log(`Client ${clientId} responded it received message: ${message}`);
};

const noiseStd = 1;

const sendDataPointsAtInterval = () => {
  const pushMessage = () => {
    const x = randomNormal();
    const y = x + randomNormal() * noiseStd;
    io.emit('data point', { x, y });
  };
  return setInterval(pushMessage, 100);
};

function onNewConnection(socket) {
  socket.on('messageReceived', message => handleMessage(socket.id, message));

  function handleDisconnect() {
    console.log(`Client disconnected, id: ${socket.id}`);
  }

  socket.on('disconnect', handleDisconnect);

  socket.on('error', (err) => {
    console.log('received error from client:', socket.id);
    console.log(err);
  });
}

const interval = sendDataPointsAtInterval();

io.on('connection', onNewConnection);

const port = 3000;
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Waiting for connections at port ${port}...`);
});

process.on('SIGINT', () => {
  clearInterval(interval);
  server.close();
});
