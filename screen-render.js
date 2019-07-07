
class ScreenRender {
  constructor({hBlockCount=8, vBlockCount=4, width=1600, height=900}={}) {
    this.hBlockCount = hBlockCount;
    this.vBlockCount = vBlockCount;
    this.blockWidth = Math.floor(width / hBlockCount);
    this.blockHeight = Math.floor(height / vBlockCount);
    this.width = width;
    this.height = height;
    this.buf = null;
    this.init = false;
  }

  setSize(width, height) {
    if (width && height) {
      this.blockWidth = Math.floor(width / this.hBlockCount);
      this.blockHeight = Math.floor(height / this.vBlockCount);
      this.width = width;
      this.height = height;
    }
  }

  attach(id='app') {
    this.parent = document.getElementById(id);
    if (this.parent) {
      this.init = false;
    }
  }

  detach() {
    if (this.parent) {
      this.parent.innerHTML = '';
      this.parent = null;
    }
  }

  setBuf(buf) {
    this.buf = buf;
    if (buf) {
      this.render();
    }
  }

  toImageBuf(buf) {
    const imageBuf = new Uint8ClampedArray((buf.byteLength - 4) * 4 / 3);
    for (let from = 0, to = 0; to < imageBuf.length; from += 3, to += 4) {
      imageBuf[to] = buf[from + 2];
      imageBuf[to + 1] = buf[from + 1];
      imageBuf[to + 2] = buf[from];
      imageBuf[to + 3] = 255;
    }
    return imageBuf;
  }

  draw(canvas) {
    const index = this.buf[this.buf.byteLength - 4];
    const offsetX = (index % this.hBlockCount) * this.blockWidth;
    const offsetY = Math.floor(index / this.hBlockCount) * this.blockHeight;
    const imageBuf = this.toImageBuf(this.buf);
    const imageData = new ImageData(imageBuf, this.blockWidth, this.blockHeight);
    canvas.getContext('2d').putImageData(imageData, offsetX, offsetY);
  }

  render() {
    if (this.parent && this.buf) {
      if (!this.init) {
        this.init = true;
        this.parent.innerHTML = `<canvas width="${this.width}" height="${this.height}">该浏览器不支持canvas</canvas>`;
      }
      this.draw(this.parent.firstChild);
    }
  }
}

module.exports = ScreenRender;