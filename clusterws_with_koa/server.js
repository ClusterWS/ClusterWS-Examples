const ClusterWS = require('clusterws');
const Koa = require('koa');
const serve = require('koa-static');

// Configure ClusterWS for more infor look at the bottom of https://github.com/ClusterWS/ClusterWS/wiki/Installation-and-Configuration
const clusterws = new ClusterWS({
  worker: Worker,
  port: 3000
});

function Worker() {
  const wss = this.wss;
  const server = this.server;

  const app = new Koa();
  app.use(serve(__dirname + '/public'));

  // Connect ClusterWS and your library/framework make sure that u call calback for Koa
  server.on('request', app.callback());

  wss.on('connection', (socket) => {
    console.log('New socket is connected');
  });
}
