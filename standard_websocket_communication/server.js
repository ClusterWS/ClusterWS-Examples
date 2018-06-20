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

  server.on('request', app);

  // Check https://github.com/ClusterWS/ClusterWS/wiki/Handle-Sockets for more info
  // Most of websocket messaging code will go in this block
  wss.on('connection', (socket) => {
    console.log('New socket is connected');

    /* 
      This is the way how we send messages to front end websocket which is connected
      to this server,

      socket.send(nameOfEvent, message)
      
      (you can send any type of data you would like)
    **/
    socket.send('greet', 'Hi frontend i am backend how are you');

    /* 
      This is the way how we listen on events (the same way we use on frontend to listen)

      socket.on(nameOfEvent, callbackFunction)
    **/
    socket.on('greetBack', (message) => {
      console.log(message);
    });
  });
}
