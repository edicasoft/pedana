export const total = arr => arr.reduce((total, val) => total + val, 0);
export const displayNumber = val => {
  const res = val.toFixed(1);
  //if (Math.abs(res) < 10) res = `0${res}`;
  return res;
};
