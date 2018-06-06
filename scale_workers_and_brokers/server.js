const ClusterWS = require('clusterws');
const express = require('express');
const os = require('os');

// Configure ClusterWS for more infor look at the bottom of https://github.com/ClusterWS/ClusterWS/wiki/Installation-and-Configuration
const clusterws = new ClusterWS({
  worker: Worker,
  port: 3000,

  // this line will run CPU number of child processes minus number of brokers you set (you can put any number you want)
  workers: os.cpus().length - 3,

  // number of brokers you would like to run
  brokers: 3

  // also you can set custom port for each broker it is not mandatory but can be useful if default ports are busy.
  // brokersPorts: [6000, 6001, 6002]
});

function Worker() {
  const wss = this.wss;
  const server = this.server;

  const app = express();
  app.use(express.static('public'));

  server.on('request', app);

  wss.on('connection', (socket) => {
    console.log('New socket is connected');
  });
}
