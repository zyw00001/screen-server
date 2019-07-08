
class ScreenRender {
  constructor({hBlockCount=8, vBlockCount=4}={}) {
    this.hBlockCount = hBlockCount;
    this.vBlockCount = vBlockCount;
    this.imageWidth = 1600;    // 图像的宽度
    this.imageHeight = 900;    // 图像的高度
    this.blockWidth = Math.floor(1600 / hBlockCount);
    this.blockHeight = Math.floor(900 / vBlockCount);
    this.buf = null;
    this.init = false;
  }

  setImageSize(width, height) {
    if (width && height) {
      this.blockWidth = Math.floor(width / this.hBlockCount);
      this.blockHeight = Math.floor(height / this.vBlockCount);
      this.imagewidth = width;
      this.imageHeight = height;
    }
  }

  setCanvasSize(width, height) {
    if (width && height) {
      const style = this.parent.firstChild.style;
      style.width = `${width}px`;
      style.height = `${height}px`;
    }
  }

  attach(id='app') {
    this.parent = document.getElementById(id);
    if (this.parent) {
      this.parent.innerHTML = `<canvas width=${this.imageWidth} height=${this.imageHeight} style='vertical-align: top'>该浏览器不支持canvas</canvas>`;
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
      this.draw(this.parent.firstChild);
    }
  }
}

module.exports = ScreenRender;