import './style.css';
import { Car } from './Car.js';
import { scaled } from './config.js';
import { initControllers, updateDashboardStats } from './ui.js';

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const cars = [];

function resize() {
  const w = canvas.parentElement.clientWidth;
  canvas.width = w;
  canvas.height = w;
}

window.addEventListener("resize", resize);
resize();

function createCars(n) {
  cars.length = 0;
  for (let i = 0; i < n; i++) {
    cars.push(new Car((Math.PI * 2 / n) * i));
  }
}

// Hubungkan Slider UI ke fungsi createCars
initControllers((newCarCount) => {
  createCars(newCarCount);
});

function drawRoad(cx, cy, R) {
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = 36;
  ctx.strokeStyle = "#2e2e2e";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = 34;
  ctx.strokeStyle = "#3a3a3a";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 12]);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();
  ctx.setLineDash([]);
}

function animate() {
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) * 0.35;

  ctx.clearRect(0, 0, W, H);
  drawRoad(cx, cy, R);

  let totalSpeed = 0, slowCount = 0;
  
  // Phase 1: Kalkulasi fisika
  for (let i = 0; i < cars.length; i++) {
    const front = cars[(i + 1) % cars.length];
    cars[i].update(front);
    
    totalSpeed += cars[i].speed;
    if (cars[i].speed < scaled.nMAX_SPEED * 0.4) slowCount++;
  }
  
  // Phase 2: Render objek dengan melempar parameter context (ctx)
  for (const car of cars) {
    car.draw(ctx, cx, cy, R);
  }

  // Phase 3: Kirim data kembali ke UI
  const avg = cars.length ? (totalSpeed / cars.length / scaled.nMAX_SPEED * 100) : 0;
  updateDashboardStats(avg, slowCount);

  requestAnimationFrame(animate);
}

// Inisialisasi awal armada (default 12 sesuai HTML)
createCars(12);
animate();