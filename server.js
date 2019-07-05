const express = require('express');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;
const ScreenRender = require('./screen-render');
const Users = require('./users');

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

const initWebSocket = (screenRender, users) => {
  const wss = new WebSocketServer({server});

  users.attach();
  users.setMonitor(((user) => {
    if (user) {
      users.detach();
      screenRender.attach();
      user.ws.send('screen-shot-play');
    }
  }));

  wss.on('connection', (ws, req) => {
    users.addUser(ws, '新用户...');
    ws.send('hardware-info');

    ws.on('message', (data) => {
      if (typeof data === 'string') {
        const json = JSON.parse(data);
        if (json.type === 'hardware-info') {
          users.addUser(ws, json.mac || 'mac错误');
        }
      } else {
        screenRender.setBuf(data);
      }
    });

    ws.on('close', () => {
      users.removeUser(ws);
    });
  });
};

initWebSocket(new ScreenRender(), new Users());