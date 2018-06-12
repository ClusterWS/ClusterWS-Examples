const ClusterWS = require('clusterws');
const express = require('express');

// Configure ClusterWS for more infor look at the bottom of https://github.com/ClusterWS/ClusterWS/wiki/Installation-and-Configuration
const clusterws = new ClusterWS({
  worker: Worker,
  port: 3000,
  // Will create few workers for this example
  workers: 2
});

function Worker() {
  const wss = this.wss;
  const server = this.server;

  const app = express();
  app.use(express.static('public'));

  // Connect ClusterWS and Express
  server.on('request', app);

  // This function is called when another worker or server emit message (Design for servers communications only)
  wss.setMiddleware('onMessageFromWorker', (data) => {
    // note you will get 4 message as this function executes on the worker from which you have send message as well
    console.log(`Current worke pid ${process.pid} got message: \n ${JSON.stringify(data, null, 4)}`);
  });

  // You can call this function any where, where you have access to wss
  // Do not use wss.publishToWorkers to communicate between clients as it would not be afficiante way (Pub/Sub works pretty much the same but it is specially optimized for client communications)
  // Use this function only to send messages to the workers.
  setTimeout(() => {
    wss.publishToWorkers({
      workerPid: process.pid,
      message: 'Testing me out'
    });
  }, 5000);

  wss.on('connection', (socket) => {
    wss.publishToWorkers({
      workerPid: process.pid,
      message: 'New socket has been connected'
    });
    console.log('New socket is connected');
  });
}
