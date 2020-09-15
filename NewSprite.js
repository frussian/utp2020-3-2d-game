class Sprite {

  constructor (img, srcX, srcY, srcW, srcH, x, y, framesY) {
    this.image = img;
    this.srcX = srcX;
    this.srcY = srcY;
    this.framesY = framesY;
    this.indexFrameY = 0;
    this.x = x;
    this.y = y;
    this.currentFrame = [];
    this.tickCount = img.width / srcW;
    this.countIndexY = img.height / srcH;
    this.width = srcW;
    this.height = srcH;
    this.speed = 5;
    this.counter = 0;
    for (let i = 0; i!=framesY.length; i++){
      this.currentFrame[i] = 0;
    }
  }

  update() {
      if (this.counter === (this.speed - 1)) {
      this.currentFrame[this.indexFrameY] = ++this.currentFrame[this.indexFrameY] % this.tickCount;
      this.srcX = this.currentFrame[this.indexFrameY] * this.width;
      this.srcY = this.framesY[this.indexFrameY] * this.height;
    }

      this.counter = (this.counter + 1) % this.speed;
  }

  reverseUpdate() {
    this.srcX -= this.width;
    this.srcY = this.framesY[this.indexFrameY] * this.height;
    if (this.srcX < 0) this.srcX = 0;
  }

  drawSprite() {
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.canvasW,
        this.canvasH
    );
  }

  drawFeet(deg, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(deg);
    ctx.translate(-x, -y);
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.canvasW,
        this.canvasH
    );
    ctx.restore();
  }

  drawBodySprite() {
        ctx.save();
        let x = worldToCanvas(player.weaponX, 0);
        let y = worldToCanvas(player.weaponY, 1);
        let deg = 0;
        let x1 = this.x;
        let y1 = this.y;
        let len1 = Math.sqrt(Math.pow(sight.x - x1, 2) + Math.pow(sight.y - y1, 2));
        let vec1 = [(sight.x - x1) / len1, (sight.y - y1) / len1];

        if (sight.x < x1) {
          if (sight.y > y1) {
            deg = Math.PI / 2 + Math.acos(vec1[1]);
          } else {
            deg = Math.PI + Math.acos(-vec1[0])
          }
        } else {
          if (sight.y > y1) {
            deg = Math.acos(vec1[0]);
          } else {
            deg = 3 * Math.PI / 2 + Math.acos(-vec1[1]);
          }
        }

        let point = {
          "x" : (x - x1)*Math.cos(deg) - (y - y1)*Math.sin(deg) + x1,
          "y" : (x - x1)*Math.sin(deg) + (y - y1)*Math.cos(deg) + y1,
        }
        let L = Math.sqrt(Math.pow(sight.x - point.x, 2) + Math.pow(sight.y - point.y, 2));
        let X = (sight.x - point.x) / L;
        let Y = (sight.y - point.y) / L;
        deg -= Math.acos(X * vec1[0] + Y * vec1[1]);

        ctx.translate(this.x, this.y);
        player.angle = deg;
        ctx.rotate(deg);
        ctx.translate(-this.x, -this.y);
        ctx.drawImage(
            this.image,
            this.srcX,
            this.srcY,
            this.width,
            this.height,
            worldToCanvas(player.x, 0),
            worldToCanvas(player.y, 1),
            this.canvasW,
            this.canvasH
        );
        ctx.restore();
  }

  drawBot(sightX, sightY, x, y, wX, wY) {
    ctx.save();
    let deg = 0;
    let len1 = Math.sqrt(Math.pow(sightX - this.x, 2) + Math.pow(sightY - this.y, 2));
    let vec1 = [(sightX - this.x) / len1, (sightY - this.y) / len1];

    if (sightX < this.x) {
      if (sightY > this.y) {
        deg = Math.PI / 2 + Math.acos(vec1[1]);
      } else {
        deg = Math.PI + Math.acos(-vec1[0]);
        }
    } else {
      if (sightY > this.y) {
        deg = Math.acos(vec1[0]);
        } else {
        deg = 3 * Math.PI / 2 + Math.acos(-vec1[1]);
        }
      }

    let point = {
      "x" : (wX - this.x)*Math.cos(deg) - (wY - this.y)*Math.sin(deg) + this.x,
      "y" : (wX - this.x)*Math.sin(deg) + (wY - this.y)*Math.cos(deg) + this.y,
        }
    let L = Math.sqrt(Math.pow(sightX - point.x, 2) + Math.pow(sightY - point.y, 2));
    let X = (sightX - point.x) / L;
    let Y = (sightY - point.y) / L;
    deg -= Math.acos(X * vec1[0] + Y * vec1[1]);
    ctx.translate(this.x, this.y);
    ctx.rotate(deg);
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
        this.image,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        worldToCanvas(x, 0),
        worldToCanvas(y, 1),
        this.canvasW,
        this.canvasH
    );
    ctx.restore();
    return deg;
  }

  setWorldSize(W , H) {
    this.worldW = W;
    this.worldH = H;
    this.canvasW = W * (1 / camera.scaleX);
    this.canvasH = H * (1 / camera.scaleY);
  }

}
