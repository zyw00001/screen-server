import React from 'react';
import ReactDOM from 'react-dom';
import {remote} from 'electron';
const {Menu, MenuItem} = remote;

function toImageBuf(buf) {
  const imageBuf = new Uint8ClampedArray((buf.byteLength - 4) * 4 / 3);
  for (let from = 0, to = 0; to < imageBuf.length; from += 3, to += 4) {
    imageBuf[to] = buf[from + 2];
    imageBuf[to + 1] = buf[from + 1];
    imageBuf[to + 2] = buf[from];
    imageBuf[to + 3] = 255;
  }
  return imageBuf;
}

function draw(canvas, buf, hBlockCount, vBlockCount, imageWidth, imageHeight) {
  const index = buf[buf.byteLength - 4];
  const blockWidth = Math.floor(imageWidth / hBlockCount);
  const blockHeight = Math.floor(imageHeight / vBlockCount);
  const offsetX = (index % hBlockCount) * blockWidth;
  const offsetY = Math.floor(index / hBlockCount) * blockHeight;
  const imageBuf = toImageBuf(buf);
  const imageData = new ImageData(imageBuf, blockWidth, blockHeight);
  canvas.getContext('2d').putImageData(imageData, offsetX, offsetY);
}

function clear(canvas) {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onReturn = this.onReturn.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  createMenu() {
    const menu = new Menu();
    const user = this.props.user;
    menu.append(new MenuItem({label: '返回', click: this.onReturn}));
    if (user) {
      if (!user.status) {
        menu.append(new MenuItem({label: '暂停', click: this.onPause}));
      } else if (user.status === 'pause') {
        menu.append(new MenuItem({label: '播放', click: this.onPlay}));
      }
      menu.append(new MenuItem({label: '停止', click: this.onStop}));
    }
    return menu;
  }

  onReturn() {
    this.props.history.goBack();
  }

  onPlay() {
    const {user, index, onSetStatus} = this.props;
    user.ws.send('screen-shot-play');
    onSetStatus(index, '');
  }

  onPause() {
    const {user, index, onSetStatus} = this.props;
    user.ws.send('screen-shot-stop');
    onSetStatus(index, 'pause');
  }

  onStop() {
    const {index, onSetStatus} = this.props;
    onSetStatus(index, 'stop');
  }

  onContextMenu() {
    const menu = this.createMenu();
    menu.popup({window: remote.getCurrentWindow()});
  }

  drawImage(buf) {
    const user = this.props.user;
    const canvas = ReactDOM.findDOMNode(this);
    draw(canvas, buf, 8, 4, user.width || 1600, user.height || 900);
  }

  clearCanvas() {
    clear(ReactDOM.findDOMNode(this));
  }

  onMessage(data) {
    if (typeof data !== 'string') {
      this.drawImage(data);
    }
  }

  componentDidMount() {
    const {user} = this.props;
    if (user) {
      user.ws.on('message', this.onMessage);
      user.ws.send('screen-shot-play');
    }
  }

  componentDidUpdate(prevProps) {
    const preUser = prevProps.user;
    const user = this.props.user;
    if (preUser && user) {
      if (preUser.ws !== user.ws) {
        preUser.ws.off('message', this.onMessage);
        user.ws.on('message', this.onMessage);
        if (!preUser.status) {
          preUser.ws.send('screen-shot-stop');
        }
        this.clearCanvas();
        user.ws.send('screen-shot-play');
      }
    } else if (user) {
      user.ws.on('message', this.onMessage);
      user.ws.send('screen-shot-play');
    } else if (preUser) {
      preUser.ws.off('message', this.onMessage);
      if (!preUser.status) {
        preUser.ws.send('screen-shot-stop');
      }
      this.clearCanvas();
    }
  }

  componentWillUnmount() {
    const user = this.props.user;
    if (user) {
      user.ws.off('message', this.onMessage);
      user.ws.send('screen-shot-stop');
    }
  }

  getProps() {
    const user = this.props.user || {};
    return {
      width: user.width || 1600,
      height: user.height || 900,
      style: {
        verticalAlign: 'top',
        width: this.props.canvasWidth,
        height: this.props.canvasHeight
      },
      onContextMenu: this.onContextMenu
    };
  };

  render() {
    return <canvas {...this.getProps()}>该浏览器不支持canvas</canvas>;
  }
}

export default Screen;