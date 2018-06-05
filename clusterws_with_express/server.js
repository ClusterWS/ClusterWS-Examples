const ClusterWS = require('clusterws');
const express = require('express');

// Configure ClusterWS for more infor look at the bottom of https://github.com/ClusterWS/ClusterWS/wiki/Installation-and-Configuration
const clusterws = new ClusterWS({
  worker: Worker,
  port: 3000
});

function Worker() {
  const wss = this.wss;
  const server = this.server;

  const app = express();
  app.use(express.static('public'));

  // Connect ClusterWS and your library/framework
  server.on('request', app);

  wss.on('connection', (socket) => {
    console.log('New socket is connected');
  });
}
