const randomNormal = require('random-normal');
const server = require('http').createServer()
const io = require('socket.io')(server)

const handleMessage = (clientId, message) => {
  console.log(`Client ${clientId} responded it received message: ${message}`);
}

const noiseStd = 0.1;

const sendDataPointsAtInterval = () => {
  const pushMessage = () => {
    const x = randomNormal();
    const y = x + randomNormal() * noiseStd;
    io.emit('data point', { x, y });
  }
  return setInterval(pushMessage, 1000);
}

function onNewConnection(socket) {
  socket.on('messageReceived', (message) => handleMessage(socket.id, message))

  socket.on('disconnect', handleDisconnect);

  socket.on('error', function (err) {
    console.log('received error from client:', socket.id)
    console.log(err)
  })

  function handleDisconnect() {
    console.log(`Client disconnected, id: ${socket.id}`);
  }

}

const unsubscribeDataPoints = sendDataPointsAtInterval();

io.on('connection', onNewConnection);

server.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})
