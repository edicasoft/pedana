const leftPlatformCells = [
  {
    x: -61,
    y: 195
  },
  {
    x: -220,
    y: 60
  },
  {
    x: -26,
    y: -255
  }
];
const rightPlatformCells = [
  {
    x: 61,
    y: 195
  },
  {
    x: 220,
    y: 60
  },
  {
    x: 26,
    y: -255
  }
];
const canvasSmoothCoef = 0.5;
const idealBarycenterLeftX = -102.3333;
const idealBarycenterRightX = 102.3333;
const images = [
  `img/triangle-red.png`,
  `img/triangle-green.png`,
  "img/triangle-yellow.png"
];
export {
  leftPlatformCells,
  rightPlatformCells,
  canvasSmoothCoef,
  idealBarycenterLeftX,
  idealBarycenterRightX,
  images
};
