const ClusterWS = require('clusterws');
const express = require('express');

// Configure ClusterWS for more infor look at the bottom of https://github.com/ClusterWS/ClusterWS/wiki/Installation-and-Configuration
const clusterws = new ClusterWS({
  worker: Worker,
  port: 3000
});

// Note that pub sub allows to communicate between all clients including from different workers and servers
function Worker() {
  const wss = this.wss;
  const server = this.server;

  const app = express();
  app.use(express.static('public'));

  server.on('request', app);

  // Listen on commonChannel check https://github.com/ClusterWS/ClusterWS/wiki/Pub-Sub-System
  wss.setWatcher('commonChannel', (message) => {
    console.log(message);
  });

  // to remove watcher use 
  // wss.removeWatcher('commonChannel')

  // Most of websocket messaging code will go in this block
  wss.on('connection', (socket) => {
    console.log('New socket is connected');

    // monsy of the pubsub code usualy will be in front end. Check index.html for basic setup

    // To publish messages from server to all users subscribe to the specific channel use
    // wss.publish('channel name', 'your message')

    // Check https://github.com/ClusterWS/ClusterWS/wiki/Pub-Sub-System for more info
  });
}
