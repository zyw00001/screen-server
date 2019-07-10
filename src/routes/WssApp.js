import React from 'react';
import ws from 'ws';

const WebSocketServer = ws.Server;

class WssApp extends React.Component {
  constructor(props) {
    super(props);
    this.wss = new WebSocketServer({server: props.server});
    this.wss.on('connection', this.onConnection.bind(this));
  }

  onConnection(ws) {
    this.props.onAddUser(this.props.users, ws);
    ws.on('message', this.onMessage.bind(this, ws));
    ws.on('close', this.onClose.bind(this, ws));
    ws.send('hardware-info');
  }

  onMessage(ws, data) {
    if (typeof data === 'string') {
      const json = JSON.parse(data);
      if (json.type === 'hardware-info') {
        this.props.onSetUser(this.props.users, ws, json);
      }
    } else {
      //screens.setScreenImage(users.getUser(ws), data);
    }
  }

  onClose(ws) {
    this.props.onRemoveUser(this.props.users, ws);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default WssApp;