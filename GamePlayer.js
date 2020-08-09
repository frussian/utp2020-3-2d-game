'use strict'
// индексы для спрайтов действия игрока(в классе NewSprite для framesY)
// 0 - ходьба с ak-47
// 1 - reload ak-47
// 2 - ходьба с shotgun
// 3 - reload  shotgun

class Player {

  constructor (x, y, width, height, speed, sprite) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.X_Center = this.x + this.w / 2;
    this.Y_Center = this.y + this.h / 2;
    this.radius = 5;
    this.sprite = sprite;
    this.speed = speed;
    this.prevDirect = "Down";
    this.direction = "Down";
    this.hp = 2;
    this.dead = false;
    this.fire = false;
    this.weapon = new Weapon(2);
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
    this.sprite.shoot.speed = 10;
    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;
  }

  drawDirection() {
    if (this.direction === "Down") {
      this.sprite.down.drawBodySprite();
    }
    if (this.direction === "Up") {
      this.sprite.up.drawBodySprite();
    }
    if (this.direction === "Left") {
      this.sprite.left.drawBodySprite();
    }
    if (this.direction === "Right") {
      this.sprite.right.drawBodySprite();
    }
    if (this.fire) {
      if (!this.weapon.emptyMagazine()) {
        this.sprite.shoot.drawBodySprite();
      } else {
        this.sprite.pl.drawBodySprite();
      }
    }

    if (!this.fire) {
      if (this.weapon.isReloading()) {
        this.sprite.pl.drawBodySprite();
        this.weapon.drawReload(sight.x, sight.y, sight.width + sight.dotSize / 2 + sight.offset);
      } else {
        switch (this.weapon.id) {
          case 0:
            this.sprite.pl.indexFrameY = 0;
          case 2:
            this.sprite.pl.indexFrameY = 2;
            break;
        }
        this.sprite.pl.drawBodySprite();
      }
    }
  }

  move() {
    if (downPressed) {
      if (this.y < images["map"].naturalHeight) {
        this.y += this.speed;
        // временный костыль, связанный с недоработкой сетки навигации
        if (this.y >= images["map"].naturalHeight) {
          this.y = images["map"].naturalHeight - 1;
        }
        //
        this.Y_Center += this.speed;
      }
      this.sprite.down.x = worldToCanvas(this.x, 0);
      this.sprite.down.y = worldToCanvas(this.y, 1);
      this.direction = "Down";
      this.sprite.down.update();
    } else if (upPressed) {
      if (this.y !== 0) {
        this.y -= this.speed;
        this.Y_Center -= this.speed;
      }
      this.sprite.up.x = worldToCanvas(this.x, 0);
      this.sprite.up.y = worldToCanvas(this.y, 1);
      this.direction = "Up";
      this.sprite.up.update();
    }

    if (rightPressed) {
      if (this.x < images["map"].naturalWidth) {
        this.x += this.speed;
        if (this.x >= images["map"].naturalWidth) {
          this.x = images["map"].naturalWidth - 1;
        }
        this.X_Center += this.speed;
      }
      this.sprite.right.x = worldToCanvas(this.x, 0);
      this.sprite.right.y = worldToCanvas(this.y, 1);
      this.direction = "Right";
      this.sprite.right.update();
    } else if (leftPressed) {
      if (this.x !== 0) {
        this.x -= this.speed;
        this.X_Center -= this.speed;
      }
      this.sprite.left.x = worldToCanvas(this.x, 0);
      this.sprite.left.y = worldToCanvas(this.y, 1);
      this.direction = "Left";
      this.sprite.left.update();
    }


    this.XBlock = (this.x - (this.x % worldTileSize)) / worldTileSize;
    this.YBlock = (this.y - (this.y % worldTileSize)) / worldTileSize;

    if (changeShootingMode) {
      this.weapon.switchShootingMode();
      changeShootingMode = false;
    }

    if (reloadPending) {
      this.weapon.reload();
      switch (this.weapon.id) {
        case 0:
          this.sprite.pl.indexFrameY = 1;
        case 2:
          this.sprite.pl.indexFrameY = 3;
          break;
      }
      reloadPending = false;
    }

    this.sprite.pl.x = worldToCanvas(this.x, 0);
    this.sprite.pl.y = worldToCanvas(this.y, 1);
    this.sprite.pl.update();

    if (mouseDown) {
      this.fire = true;
      switch (this.weapon.id) {
        case 0:
          this.sprite.shoot.indexFrameY = 0;
          this.sprite.shoot.x = this.sprite.pl.x;
          this.sprite.shoot.y = this.sprite.pl.y;
          break;
        case 2:
          this.sprite.shoot.indexFrameY = 1;
          this.sprite.shoot.x = this.sprite.pl.x;
          this.sprite.shoot.y = this.sprite.pl.y;
          break;
      }
      this.sprite.shoot.update();
      let k1 = 12.5;
      let k2 = 0;
      let k3 = (canvasToWorld(sight.x, 0) - this.x);
      let k4 = (canvasToWorld(sight.y, 1) - this.y);
      let dist1 = Math.sqrt(k1*k1 + k2*k2);
      let dist2 = Math.sqrt(k3*k3 + k4*k4);
      let normLen = 3;
      let normX = -k4 / dist2 * normLen;
      let normY = k3 / dist2 * normLen;

      this.weapon.shoot(this.x + (canvasToWorld(sight.x, 0) - this.x) * dist1 / dist2 + normX,
                        this.y + (canvasToWorld(sight.y, 1) - this.y) * dist1 / dist2 + normY ,
                        canvasToWorld(sight.x, 0) + normX, canvasToWorld(sight.y, 1) + normY);
      this.weapon.shootExecuted = 1;
    } else {
      this.fire = false;
      this.weapon.shootExecuted = 0;
    }
  }

  changeWeapon(id) {
    this.weapon = new Weapon(id);
    switch (this.weapon.id) {
      case 0:
        this.sprite.pl.indexFrameY = 0;
      case 2:
        this.sprite.pl.indexFrameY = 2;
        break;
    }
  }

  vis(tx, ty) {
    let degRad = Math.acos((tx - mesh[this.XBlock][this.YBlock].x) /
                 Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) +
                 Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2)));
    if (ty > mesh[this.XBlock][this.YBlock].y) {
      degRad += Math.PI;
    } else {
      degRad = Math.PI - degRad;
    }
    let deg = degRad * 180 / Math.PI;
    deg = (deg - (deg % 10)) / 10;
    let dist = Math.sqrt(Math.pow((tx - mesh[this.XBlock][this.YBlock].x), 2) + Math.pow((ty - mesh[this.XBlock][this.YBlock].y), 2));
    return mesh[(tx - (tx % worldTileSize)) / worldTileSize][(ty - (ty % worldTileSize)) / worldTileSize].vision[deg] > dist;
  }
}