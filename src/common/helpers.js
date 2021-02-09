export const total = arr => arr.reduce((total, val) => total + val, 0);
export const toFixed2 = val => Math.round((val + Number.EPSILON) * 100) / 100;
