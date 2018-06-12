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

  // Connect ClusterWS and Express
  server.on('request', app);

  // This function is called on new websocket connection
  wss.setMiddleware('verifyConnection', (info, next) => {
    // get url from which connection is comming
    console.log(`verifyConnection called ${info.origin}`);

    next(true); // Allow connection
    // next(false) // Drop connection
  });

  // This function is called on new subscribe
  wss.setMiddleware('onSubscribe', (socket, channel, next) => {
    // You can check which socket is subscribing to which channel
    console.log(`Subscription called to ${channel} channel`);
    // next(false) // Drop subscription

    next(true); // Allow subscription
  });

  // This function is called on publish event
  wss.setMiddleware('onPublish', (channel, data) => {
    console.log(`Publish happened on ${channel} with ${data}`);
  });

  wss.on('connection', (socket) => {
    console.log('New socket is connected');
  });
}
