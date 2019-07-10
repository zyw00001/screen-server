import express from 'express';
import bodyParser from 'body-parser';
import ReactDOM from 'react-dom';
import getStore from './store';
import getRoutes from './routes';

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

const store = getStore();
const routes = getRoutes(store, server);
ReactDOM.render(routes, document.getElementById('app'));
