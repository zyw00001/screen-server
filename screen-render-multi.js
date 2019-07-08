const ScreenRender = require('./screen-render');

class ScreenRenderMulti {
  constructor() {
    this.hCount = 8;
    this.vCount = 8;
    this.count = this.hCount * this.vCount;
    this.width = window.innerWidth / this.hCount;
    this.height = window.innerHeight / this.vCount;
    this.screens = new Array(this.count);
    this.screens.fill(null);
    this.parent = null;
    this.needAttach = false;
    this.onWindowSizeChange = this.onWindowSizeChange.bind(this);
  }

  createScreen(user, index) {
    const screenRender = new ScreenRender();
    screenRender.setImageSize(user.width, user.height);
    if (this.parent) {
      screenRender.attach(`screen${index}`);
      screenRender.setCanvasSize(this.width, this.height);
    }
    return screenRender;
  }

  setScreens(users) {
    let index = 0;
    for (const user of users) {
      if (user) {
        this.needAttach = !this.parent;
        this.screens[index] = {user, screenRender: this.createScreen(user, index)};
        index++;
        if (index >= this.count) {
          return;
        }
      }
    }
  }

  setScreenByIndex(user, index) {
    if (this.parent && index >= 0 && index < this.count) {
      const s = this.screens[index];
      if (s) {
        s.attach();
        this.screens[index] = null;
      }

      if (user) {
        this.screens[index] = {user, screenRender: this.createScreen(user, index)};
      }
    }
  }

  setScreenImage(user, imgBuf) {
    if (this.parent && user && imgBuf) {
      const s = this.screens.find(s => s && s.user === user);
      if (s) {
        s.screenRender.setBuf(imgBuf);
      }
    }
  }

  getScreenUser(index) {
    if (this.parent && index >= 0 && index < this.count) {
      if (this.screens[index]) {
        return this.screens[index].user;
      }
    }
    return null;
  }

  attach(id='app') {
    this.parent = document.getElementById(id);
    if (this.parent) {
      let children = '';
      for (let index = 0; index < this.count; index++) {
        children += `<div id='screen${index}'></div>`;
      }
      this.parent.innerHTML = `<div class='screen-render-multi'>${children}</div>`;

      if (this.needAttach) {
        this.screens.forEach((s, index) => {
          s && s.screenRender.attach(`screen${index}`);
        });
        this.needAttach = false;
      }
      this.onWindowSizeChange();
      window.addEventListener('resize', this.onWindowSizeChange);
    }
  }

  detach() {
    if (this.parent) {
      this.parent.innerHTML = '';
      this.parent = null;
      this.screens.fill(null);
      window.removeEventListener('resize', this.onWindowSizeChange);
    }
  }

  onWindowSizeChange() {
    this.width = Math.floor(window.innerWidth / this.hCount);
    this.height = Math.floor(window.innerHeight / this.vCount);
    this.screens.forEach((s) => {
      s && s.screenRender.setCanvasSize(this.width, this.height);
    });

    for (const node of this.parent.firstChild.childNodes) {
      node.style.width = `${this.width}px`;
      node.style.height = `${this.height}px`;
    }
  };

  render() {
    if (this.parent) {
      this.screens.forEach(s => s && s.screenRender.render());
    }
  }
}

module.exports = ScreenRenderMulti;