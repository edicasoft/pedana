export const total = arr => arr.reduce((total, val) => total + val, 0);
//TODO::format number to 08.8
export const displayNumber = val => {
  const res = Math.round((val + Number.EPSILON) * 10) / 10;
  return res;
};
