const express = require('express');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;
const ScreenRender = require('./screen-render');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '512kb'}));

app.get('/', (req, res) => {
  res.send({message: '正在开发中...'});
});

app.use((err, req, res, next) => {
  res.send('error');
});

const port = 9000;
const server = app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});

const initWebSocket = (screenRender) => {
  const wss = new WebSocketServer({server});

  wss.on('connection', (ws, req) => {
    console.log('connection');

    ws.on('message', (data) => {
      if (typeof data === 'string') {

      } else {
        screenRender.render(data);
      }
    });

    ws.on('close', () => {
      console.log('close');
    });

    ws.send('screen-shot-play');
  });
};

initWebSocket(new ScreenRender());