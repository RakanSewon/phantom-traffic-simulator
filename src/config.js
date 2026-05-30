// Parameter mentah (dari UI)
export const params = {
  MAX_SPEED: 40,
  ACCEL: 5,
  BRAKE: 12,
  SAFE: 6,
  DELAY: 750,
  TRACK_LENGTH: 200,
  stepSize: 10,
  SLOWING_DISTANCE: 30,
  SLOWING_FACTOR: 5
};

// Parameter yang sudah di-scaling untuk kalkulasi fisika canvas
export const scaled = {
  nMAX_SPEED: 0,
  nACCEL: 0,
  nBRAKE: 0,
  nSAFE: 0,
  nDELAY: 0,
  nSLOWING_DISTANCE: 0,
  nDECELERATE: 0
};

export function toRad(val) {
  return 2 * Math.PI * val / params.TRACK_LENGTH;
}

export function updateScaledVariables() {
  scaled.nMAX_SPEED = toRad(params.MAX_SPEED) * (params.stepSize / 1000);
  scaled.nACCEL = toRad(params.ACCEL) * (params.stepSize / 1000) * (params.stepSize / 1000);
  scaled.nBRAKE = toRad(params.BRAKE) * (params.stepSize / 1000) * (params.stepSize / 1000);
  // scaled.nDECELERATE = toRad(params.SLOWING_FACTOR) * (params.stepSize / 1000) * (params.stepSize / 1000);
  scaled.nSAFE = toRad(params.SAFE);
  // scaled.nSLOWING_DISTANCE = toRad(params.SLOWING_DISTANCE)
  
  // Menggunakan Math.round agar indeks array tidak menerima nilai float
  scaled.nDELAY = Math.max(1, Math.round(params.DELAY / params.stepSize)); 
}

// Inisialisasi awal
updateScaledVariables();