export const total = arr => arr.reduce((total, val) => total + val, 0);
//TODO::format number to 08.8
export const displayNumber = val =>
  Math.round((val + Number.EPSILON) * 100) / 100;
