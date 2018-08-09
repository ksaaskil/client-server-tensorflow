const server = require('http').createServer()
const io = require('socket.io')(server)

const handleMessage = (clientId, message) => {
  console.log(`Client ${clientId} responded it received message: ${message}`);
}

const setIntervalMessages = (client) => {
  let number = 1;
  const pushMessage = () => {
    client.emit('message', `Message from server #${number}`);
    number++;
  }
  return setInterval(pushMessage, 1000);
}

function onConnection(client) {
  client.on('messageReceived', (message) => handleMessage(client.id, message))

  client.on('disconnect', handleDisconnect);

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })

  const clearIv = setIntervalMessages(client);

  function handleDisconnect() {
    console.log(`Client disconnected, id: ${client.id}`);
    clearInterval(clearIv);
  }
}

io.on('connection', onConnection);

server.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})
