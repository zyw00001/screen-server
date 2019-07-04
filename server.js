const express = require('express');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;

const swapRB = (buf) => {
  for (let i = 0; i < buf.length; i += 4) {
    const ch = buf[i];
    buf[i] = buf[i + 2];
    buf[i + 2] = ch;
  }
  return buf;
};

const drawBuffer = (buf) => {
  const canvas = document.getElementById('app');
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(new Uint8ClampedArray(swapRB(buf)), 1600, 900);
  ctx.putImageData(imageData, 0, 0);
};

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

const initWebSocket = () => {
  const wss = new WebSocketServer({server});

  wss.on('connection', (ws, req) => {
    console.log('connection');

    ws.on('message', (data) => {
      if (typeof data === 'string') {

      } else {
        drawBuffer(data);
      }
    });

    ws.on('close', () => {
      console.log('close');
    });

    ws.send('screen-shot-play');
  });
};

initWebSocket();