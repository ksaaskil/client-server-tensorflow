<template>
  <div id="app">
    <h1>{{ data.msg }}</h1>
    <h2> Socket connected: {{ data.connected }}</h2>
    <h2 v-if="data.err">Socket error: {{ data.err }}</h2>
    <!--<h3 v-if="data.news"> News: {{ data.news }}</h3>-->
    <!--<h3 v-if="!data.news">No news yet from other clients!</h3>-->
    <canvas id="dataPoints" ref="dataPoints" width="200" height="200"></canvas>
  </div>
</template>

<script>
const io = require('socket.io-client')
const Chart = require('chart.js');

const data = { 
  msg: 'Waiting for messages from server...',
  err: undefined,
  connected: false,
  news: undefined
};

let lineData = {
  datasets: [{
    label: "Received data",
    data: [],
    pointRadius: 10,
    pointBackgroundColor: "#0000ff"
  }]};

Chart.defaults.global.animation.duration = 0;

function drawChart(el) {
  const ctx = el.getContext('2d');
  return new Chart(ctx, {
    type: 'scatter',
    data: lineData,
    options: {}
  });
}

function initializeSocket(onDataPointReceived) {
  const socket = io.connect('http://localhost:3000', {'forceNew': true});

  socket.on('connect', () => {
    data.connected = true;
  });

  socket.on('error', function (err) {
    console.err('Received socket error', err);
    data.err = err.message;
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    socket.close();
    data.connected = false;
  });

  socket.on('data point', onDataPointReceived);

}

let chart;

export default {
  name: 'app',
  data () {
    return {
      data,
      chart
    }
  },
  created() {
    initializeSocket(this.onDataPointReceived);
  },
  methods: {
    onDataPointReceived: function(dataPoint) {
      console.log(`Received data point ${JSON.stringify(dataPoint)}`);
      const { x, y } = dataPoint;
      this.addData(x, y);
    },
    addData: function addData(x, y) {
      this.chart.data.datasets[0].data.push({ x, y});
      this.chart.update();
    }
  },
  mounted() {
    this.chart = drawChart(this.$refs.dataPoints);
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
