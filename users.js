
class Users {
  constructor() {
    this.users = [];
    this.parent = null;
    this.onMonitor = null;
  }

  addUser(ws, mac) {
    const index = this.users.findIndex(user => user.ws === ws);
    if (index > -1) {
      this.users[index].mac = mac;
    } else {
      this.users.push({mac, ws});
    }
    this.render();
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
        return `<li>${user.mac}</li>`;
      };
      this.parent.innerHTML = `<div class='users'><div><button>监控</button><span>用户:${this.users.length}</span></div><ul>${this.users.map(renderUser)}</ul></div>`;
      this.parent.firstChild.firstChild.addEventListener('click', () => {
        this.onMonitor && this.onMonitor(this.users[0]);
      });
    }
  }
}

module.exports = Users;