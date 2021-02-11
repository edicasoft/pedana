export const total = arr => arr.reduce((total, val) => total + val, 0);
export const displayNumber = val => {
  let res = val.toFixed(1);
  if (res < 10) res = `0${res}`;
  return res;
};
