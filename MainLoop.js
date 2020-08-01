'use strict'

const update = () => {
  for (let bullet of bullets) {
    bullet.updateCoordinates();
    for (let i = 0; i < targets.length; i++) {
      if (bullet.collide(targets[i].x, targets[i].y, targets[i].r)) {
        targets[i].shooted = false;
      }
    }
  }

  bullets.forEach(b => (b.x < 0 ||
                        b.x > mapImg.naturalHeight ||
                        b.y < 0 ||
                        b.y > mapImg.naturalWidth) ? bullets.delete(b) : b );

  player.move();
  for (let i = 0; i < targets.length; i++) {
    targets[i].update();
  }
  camera.updateCoordinates();
}

const drawPosit = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("x: " + player.x + " y: " + player.y + " / " + "x: " + sight.x + " y: " + sight.y + " / " + bullets.size +
  " Ammo: " + player.weapon.bullets + " / " + player.weapon.magazines.reduce( (accumulator, currentValue) => accumulator + currentValue, 0), 20, 20);
}

const drawTileTypes = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "red";

  let minX = Math.floor(camera.x / worldTileSize);
  let maxX = Math.ceil((camera.x + camera.visibleWidth) / worldTileSize);
  let minY = Math.floor(camera.y / worldTileSize);
  let maxY = Math.ceil((camera.y + camera.visibleHeight) / worldTileSize);

  for (let i = minY; i < maxY; i++) {
    for (let j = minX; j < maxX; j++) {
      switch (tileMap[i][j]) {
        case "sand":
          ctx.fillText("s", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "dark ocean":
          ctx.fillText("do", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "ocean":
          ctx.fillText("o", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "grass":
          ctx.fillText("g", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "dark grass":
          ctx.fillText("g", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "cobblestone":
          ctx.fillText("c", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
        case "dark cobblestone":
          ctx.fillText("dc", worldToCanvas(j * worldTileSize, 0), worldToCanvas(i * worldTileSize, 1));
          break;
      }
    }
  }
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  camera.drawVisibleMap();
  player.drawDirection();

  for (let bullet of bullets) bullet.draw();

  for (let i = 0; i < targets.length; i++) {
    targets[i].draw(1 / camera.scaleX);
  }

  sight.draw();
  drawPosit();
}

let lastTime = performance.now();
let now = 0;
let dt = 0;
let fps = 60;
let gameStep = 1 / fps;

const loop = () => {
  now = performance.now();
  dt += Math.min(1, (now - lastTime) / 1000);

  while (dt > gameStep) {
    dt -= gameStep;
    update();
  }

  draw();
  lastTime = now;

  RAF(loop);
}

const onImagesLoaded = (images) => {
  let notLoaded = Object.keys(images).length;

  for (let x in images) {
    if (images[x].complete) {
      notLoaded--;
    } else {
      images[x].addEventListener("load", () => {
        notLoaded--;
        if (notLoaded === 0){
          notLoaded = -1;
          loop();
        }
      });
    }
  }

  if (notLoaded === 0) {
    notLoaded = -1;
    loop();
  }

}

onImagesLoaded(images);
