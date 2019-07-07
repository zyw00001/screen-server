
class Users {
  constructor() {
    this.users = [];
    this.parent = null;
    this.onMonitor = null;
  }

  addUser(ws) {
    if (!this.users.find(user => user.ws === ws)) {
      this.users.push({ws});
      this.render();
    }
  }

  setUser(ws, mac, width, height) {
    const user = this.users.find(user => user.ws === ws);
    if (user) {
      user.mac = mac;
      user.width = width;
      user.height = height;
      this.render();
    }
  }

  removeUser(value, key='ws') {
    if (['ws', 'mac'].includes(key)) {
      const users = this.users.filter(user => user[key] !== value);
      if (users.length !== this.users.length) {
        this.users = users;
        this.render();
      }
    }
  }

  setMonitor(callback) {
    this.onMonitor = callback;
  }

  attach(id='app') {
    this.parent = document.getElementById(id);
    this.render();
  }

  detach() {
    if (this.parent) {
      this.parent.innerHTML = '';
      this.parent = null;
    }
  }

  render() {
    if (this.parent) {
      const renderUser = (user) => {
        return `<li>${user.mac || '新用户...'}</li>`;
      };
      this.parent.innerHTML = `<div class='users'><div><button>监控</button><span>用户:${this.users.length}</span></div><ul>${this.users.map(renderUser)}</ul></div>`;
      this.parent.firstChild.firstChild.addEventListener('click', () => {
        this.onMonitor && this.onMonitor(this.users[0]);
      });
    }
  }
}

module.exports = Users;