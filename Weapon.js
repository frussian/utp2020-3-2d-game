class Weapon {
  constructor(id, x = 0, y = 0) {
    switch (id) {
      case 0:
        this.damage = 1;
        this.fireRate = 1/10; //sec for 1 round
        this.bulletSpread = Math.PI / 50;
        this.stableFiringTime = 0.1;
        this.stableBullets = Math.floor(this.stableFiringTime / this.fireRate);
        this.bullets = 30;
        this.maxBullets = 30;
        this.magazines = [];
        this.magazines.push(30);
        this.magazines.push(30);
        this.bulletSpeed = 36;
        this.reloadTime = 1.5; //sec
        this.image = images["ak47"];
        this.width = 39;
        this.roundImage = images["7.62gauge"];
        this.shotSound = new Sound(sounds["shot_ak47"], 1.095, 2, 0.3, 1.5);
        break;
      case 1:
        this.damage = 1;
        this.fireRate = 1/11.6;
        this.bulletSpread = Math.PI / 80;
        this.stableFiringTime = 0.4;
        this.stableBullets = Math.floor(this.stableFiringTime / this.fireRate);
        this.bullets = 20;
        this.maxBullets = 20;
        this.magazines = [];
        this.magazines.push(20);
        this.magazines.push(20);
        this.bulletSpeed = 48;
        this.reloadTime = 1.2;
        this.image = images["m16"];
        this.width = 42;
        this.roundImage = images["5.56gauge"];
        this.shotSound = new Sound(sounds["shot_m16"], 6.21, 7.33, 0.8, 6.7);
        break;
      case 2:
        this.damage = 1;
        this.fireRate = 1;
        this.bulletSpread = Math.PI / 50;
        this.bullets = 6;
        this.maxBullets = 6;
        this.magazines = [];
        this.magazines.push(6);
        this.magazines.push(6);
        this.bulletSpeed = 45;
        this.reloadTime = 3.5;
        this.image = images["remington870"];
        this.width = 45;
        this.roundImage = images["12gauge"];
        this.shotSound = new Sound(sounds["shot_remington"], 1, 2.2, 0.3, 1.4);
        break;
    }

    this.id = id;
    this.x = x;
    this.y = y;
    this.offsetY = 0;
    this.maxOffsetY = 2;
    this.step = Math.PI / 16;
    this.stepTime = 0.05; //sec
    this.stepId = null;
    this.nullId = null;
    this.ratio = 1/4; //h/w
    this.height = this.ratio * this.width;
    this.lastBulletTime = 0;   //millisec
    this.reloading = false;
    this.reloadId = null;
    this.lastReloadTime = 0;  //millisec
    this.singleShoot = false;
    this.shootingEnabled = true;
    this.shotExecuted = false;
    this.emptyMagazineSound = new Sound(sounds["empty"], 0.6, 1);
    this.pickUpRadius = 10;
    this.countBullets = 0;
  }
  //0 - ak
  //1 - m16
  //2 - remington shotgun

  //возвращает true, если был произведен выстрел
  shoot(x, y, targetX, targetY) {
    let now = performance.now();

    if (this.singleShoot && this.shotExecuted) {
      this.shootingEnabled = false;
    } else {
      this.shootingEnabled = true;
    }

    if (!this.reloading && this.bullets > 0 &&
       (now - this.lastBulletTime) / 1000 > this.fireRate &&
        this.shootingEnabled) {
      let e = 0.02;
      if ((now - this.lastBulletTime) / 1000 < this.fireRate + e) {
        this.countBullets++;
      } else {
        this.countBullets -= Math.floor((now - this.lastBulletTime) / this.fireRate);
        if (this.countBullets < 0) this.countBullets = 0;
      }

      if (this.id === 2) {
        bullets.add(new Bullet(x, y, targetX, targetY, this.bulletSpeed, this.damage, true));
        let v1 = rotate(targetX - x, targetY - y, this.bulletSpread);
        let v2 = rotate(targetX - x, targetY - y, -this.bulletSpread);
        bullets.add(new Bullet(x, y, x + v1.x, y + v1.y, this.bulletSpeed, this.damage, false));
        bullets.add(new Bullet(x, y, x + v2.x, y + v2.y, this.bulletSpeed, this.damage, false));
      } else {
        let deg = 0;
        if (this.countBullets > this.stableBullets) {
          deg = Math.random() * 2 * this.bulletSpread - this.bulletSpread;
        }
        let v = rotate(targetX - x, targetY - y, deg);
        bullets.add(new Bullet(x, y, x + v.x, y + v.y, this.bulletSpeed, this.damage, false));
      }
      this.bullets--;

      this.dropRound(x, y, targetX, targetY);
      this.lastBulletTime = now;
      this.shotSound.play(true, {"x" : x, "y" : y});

      return true;
    } else if (this.bullets <= 0 && !this.shotExecuted) {
      this.emptyMagazineSound.play(true, {"x" : x, "y" : y});
    }

    return false;
  }

  reload() {
    if (this.magazines.length !== 0 && this.bullets !== this.maxBullets &&
        this.reloading === false) {
      this.reloading = true;
      this.lastReloadTime = performance.now();
      if (this.id === 2) {  //перезарядка дробовика
        let loaded = 0;
        loaded = this.loadShotgun(loaded);
        this.reloadId = setInterval(() => {
          loaded = this.loadShotgun(loaded);
        }, this.reloadTime / this.maxBullets * 1000);
      } else {
        this.reloadId = setTimeout(() => {
          clearTimeout(this.reloadId);
          this.reloadId = null;
          this.reloading = false;
          this.autoLoad();
        }, this.reloadTime * 1000);
      }
    };
  }

  loadShotgun(loaded) {
    if (loaded !== this.maxBullets - this.bullets && this.enoughAmmo(loaded + 1)) {
      loaded++;
    } else {
      clearInterval(this.reloadId);
      this.reloadId = null;
      this.reloading = false;
      this.load(loaded);
    }
    return loaded;
  }

  enoughAmmo(neededBullets) {
    for (let i = 0; i < this.magazines.length; i++)
      if (this.magazines[i] >= neededBullets) return true;
      else neededBullets -= this.magazines[i];

    return false;

  }

  stopReload() {
    if (this.reloadId != null) {
      if (this.id === 2) {
        clearInterval(this.reloadId);
      } else {
        clearTimeout(this.reloadId);
      }
      this.reloading = false;
      let delta = (performance.now() - this.lastReloadTime) / 1000;
      let bulletReloadTime = this.reloadTime / this.maxBullets;
      let neededBullets = Math.floor(delta / bulletReloadTime);
      this.load(neededBullets);
    }
  }


  autoLoad() {
    if (this.bullets === 0) {
      this.bullets = this.magazines[0];
      this.magazines.shift();
    } else {
      this.magazines.push(this.bullets);
      this.bullets = this.magazines[0];
      this.magazines.shift();
    }
  }

  load(neededBullets) {
    let loadedBullets = 0;
    for (let i = this.magazines.length - 1; i >= 0 && neededBullets != 0; i--) {
      if (this.magazines[i] > neededBullets) {
        this.magazines[i] -= neededBullets;
        loadedBullets += neededBullets;
        break;
      } else {
        loadedBullets += this.magazines[i];
        neededBullets -= this.magazines[i];
        this.magazines.pop();
      }
    }
    this.bullets += loadedBullets;
  }

  drawReload(x, y, r) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "gray";
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.arc(x, y, r + 1.25, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(x, y, r, 0, 2 * Math.PI * (performance.now() - this.lastReloadTime) / 1000 / this.reloadTime, false);
    ctx.stroke();
    ctx.closePath();
  }

  draw() {
    if (!this.stepId){
      this.stepId = setInterval(() => {
        this.offsetY += this.step;
      }, this.stepTime * 1000);
      this.nullId = setInterval(() => {
        this.offsetY = 0;
      }, this.stepTime * 1000 * 10000 / this.step); //offsetY не более 10 тыс
    }

    ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight,
                  worldToCanvas(this.x, 0),
                  worldToCanvas(this.y + Math.sin(this.offsetY) * this.maxOffsetY / 2 + this.maxOffsetY / 2, 1),
                  this.width / camera.scaleX, this.height / camera.scaleY);
  }

  pickUp() {
    clearInterval(this.stepId);
    clearInterval(this.nullId);
    this.stepId = null;
    this.nullId = null;
    weapons.delete(this);
  }

  drop(x, y) { //передаются координаты мира
    this.x = x;
    this.y = y;
    this.offsetY = 0;
    weapons.add(this);
  }

  dropRound(x, y, tX, tY) {
    let k1 = tX - x;
    let k2 = tY - y;
    let len = Math.sqrt(k1 * k1 + k2 * k2);
    let offsetLen = 1/2 * this.width;
    rounds.push(new Round(x - k1 / len * offsetLen, y - k2 / len * offsetLen,
                          tX, tY, this.roundImage));
  }

  emptyMagazine() { return this.bullets === 0 };
  isReloading() { return this.reloading };
  switchShootingMode() { this.singleShoot = !this.singleShoot; }

}
