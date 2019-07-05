
class ScreenRender {
  constructor({canvasId='app', hBlockCount=8, vBlockCount=4, width=1600, height=900}={}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.hBlockCount = hBlockCount;
    this.vBlockCount = vBlockCount;
    this.blockWidth = Math.floor(width / hBlockCount);
    this.blockHeight = Math.floor(height / vBlockCount);
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

  render(buf) {
    const index = buf[buf.byteLength - 4];
    const offsetX = (index % this.hBlockCount) * this.blockWidth;
    const offsetY = Math.floor(index / this.hBlockCount) * this.blockHeight;
    const imageBuf = this.toImageBuf(buf);
    const imageData = new ImageData(imageBuf, this.blockWidth, this.blockHeight);
    this.ctx.putImageData(imageData, offsetX, offsetY);
  }
}

module.exports = ScreenRender;