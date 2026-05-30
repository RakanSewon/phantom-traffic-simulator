import { params, updateScaledVariables } from './config.js';

const get = id => document.getElementById(id);

function bind(sliderId, valId, setter, fmt) {
  const sl = get(sliderId), vl = get(valId);
  sl.addEventListener("input", () => {
    const v = parseFloat(sl.value);
    setter(v);
    vl.textContent = fmt(v);
    updateScaledVariables(); 
  });
}

// Menerima callback function `onCarCountChange` dari main.js untuk meregenerate armada
export function initControllers(onCarCountChange) {
  bind("sSpeed",  "vSpeed",  v => params.MAX_SPEED = v,            v => v.toFixed(0));
  bind("sAcc",    "vAcc",    v => params.ACCEL = v,                v => v.toFixed(1));
  bind("sBrake",  "vBrake",  v => params.BRAKE = v,                v => v.toFixed(0));
  bind("sDist",   "vDist",   v => params.SAFE = v,                 v => v.toFixed(1));
  // bind("sSlowDist",   "vSlowDist",   v => params.SLOWING_DISTANCE = v, v => v.toFixed(0));
  // bind("sSlow",   "vSlow",   v => params.SLOWING_FACTOR = v,       v => v.toFixed(1));
  bind("sDelay",  "vDelay",  v => params.DELAY = Math.round(v),    v => String(Math.round(v)));

  get("sCars").addEventListener("input", () => {
    const n = parseInt(get("sCars").value);
    get("vCars").textContent = n;
    onCarCountChange(n);
  });
}

export function updateDashboardStats(avgPercentage, slowCount) {
  get("statAvg").textContent = Math.round(avgPercentage) + "%";
  get("statSlow").textContent = slowCount;
}