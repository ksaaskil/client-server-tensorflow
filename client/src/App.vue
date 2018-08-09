<template>
  <div id="app">
    <h1>{{ data.msg }}</h1>
    <h2 v-if="data.err">Socket error: {{ data.err }}</h2>
    <h2> Socket connected: {{ data.connected }}</h2>
  </div>
</template>

<script>
const io = require('socket.io-client')

const socket = io.connect('http://localhost:3000', {'forceNew': true});

const data = { 
  msg: 'Waiting for messages from server...',
  err: undefined,
  connected: false
};

const handleConnect = (server) => {
  console.log('Socket connected');
  data.connected = true;
  console.log(`Got server`, server);
}

socket.on('connect', handleConnect);

socket.on('error', function (err) {
  console.err('Received socket error', err);
  data.err = err.message;
})

let received = 0;
function onMessageReceived(msgReceived) {
  console.log(`Received message ${msgReceived}`);
  data.msg = `Got message: ${msgReceived}`;
  socket.emit('messageReceived', msgReceived);
  received++;
  if (received > 5) {
    socket.disconnect();
  }
}

socket.on('message', onMessageReceived);

socket.on('disconnect', () => {
  console.log('Socket disconnected');
  socket.close();
  data.connected = false;
});

export default {
  name: 'app',
  data () {
    return {
      data
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
