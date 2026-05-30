import { params, scaled } from './config.js';

export class Car {
  constructor(angle) {
    this.angle = angle;
    this.speed = scaled.nMAX_SPEED * (0.9 + Math.random() * 0.1);
    this.history = [];
    this.carLength = 3;
    this.slowing = false;
  }

  update(frontCar) {
    this.history.push({ angle: frontCar.angle, speed: frontCar.speed, slowing: frontCar.slowing });
    if (this.history.length > scaled.nDELAY) this.history.shift();

    const perceived = this.history.length >= scaled.nDELAY
      ? this.history[0]
      : { angle: frontCar.angle, speed: frontCar.speed, slowing: frontCar.slowing };

    let gap = perceived.angle - this.angle;
    if (gap < 0) gap += Math.PI * 2;

    let lengthRad = 2 * this.carLength * Math.PI / params.TRACK_LENGTH;

    let gap_actual = frontCar.angle - this.angle;
    if(gap_actual < 0) gap_actual += Math.PI * 2;
    if(gap_actual <= lengthRad) this.speed = 0;

    if (gap < scaled.nSLOWING_DISTANCE && this.speed > frontCar.speed){
      this.speed -= SLOWING_FACTOR;
      this.slowing;
    }

    if (gap < scaled.nSAFE) {
      this.speed -= scaled.nBRAKE;
      this.slowing;
    } else {
      this.speed += scaled.nACCEL;
      this.slowing = false;
    }

    if (Math.random() < 0.003) {
      this.speed *= 0.7 + Math.random() * 0.2;
    }

    this.speed = Math.max(0.003, Math.min(this.speed, scaled.nMAX_SPEED));
    this.angle += this.speed;
  }

  // Tambahkan ctx ke argumen untuk proses rendering terisolasi
  draw(ctx, cx, cy, R) {
    const x = cx + R * Math.cos(this.angle);
    const y = cy + R * Math.sin(this.angle);
    const tang = this.angle + Math.PI / 2;

    const isSlow    = this.speed < scaled.nMAX_SPEED * 0.4;
    const isBraking = !isSlow && this.speed < scaled.nMAX_SPEED * 0.75;
    const color     = isSlow ? "#ef5350" : isBraking ? "#ffa726" : "#4fc3f7";

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tang + Math.PI / 2);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-5, -9, 10, 18, 2);
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.roundRect(-4, -7, 8, 7, 1);
    ctx.fill();

    if (isSlow || isBraking) {
      ctx.fillStyle = isSlow ? "#ff8a80" : "#ffcc80";
      ctx.beginPath(); ctx.roundRect(-4, 7, 3, 3, 1); ctx.fill();
      ctx.beginPath(); ctx.roundRect( 1, 7, 3, 3, 1); ctx.fill();
    }

    ctx.restore();
  }
}