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

/*------------------------*/

const leftDisplayCells = [
  {
    x: -51,
    y: 211
  },
  {
    x: -203,
    y: 61
  },
  {
    x: -66,
    y: -206
  }
];
const rightDisplayCells = [
  {
    x: 53,
    y: 211
  },
  {
    x: 204,
    y: 61
  },
  {
    x: 68,
    y: -204
  }
];

const canvasSmoothCoef = 0.5;
const idealBarycenterLeftX = -102.3333;
const idealBarycenterRightX = 102.3333;
const images = [
  `img/triangle-red.png`,
  `img/triangle-green.png`,
  "img/triangle-yellow.png",
  "img/triangle-orange.png",
  "img/balls/barycenter.png",
  "img/balls/general-barycenter.png",
  "img/balls/old-general-barycenter.png",
  "img/balls/old-barycenter.png",
  "img/pedana-bg.png"
];
const Hz = 10;
const pedanaWidth = 470;
const pedanaHeight = 560;
const data = [
  [
    108.0859375,
    110.0859375,
    110.0859375,
    110.0859375,
    130.0859375,
    140.0859375
  ],
  [8.0078125, 11.23046875, 12.67578125, 10.99609375, 12.34375, 14.98046875],
  [10.01953125, 15.09765625, 5.95703125, 14.8828125, 18.88671875, 6.97265625],
  [9.82421875, 14.6484375, 7.3828125, 14.12109375, 17.16796875, 8.84765625],
  [9.47265625, 13.61328125, 9.62890625, 13.1640625, 15.56640625, 10.25390625],
  [8.828125, 12.34375, 11.484375, 11.81640625, 13.7890625, 12.75390625],
  [8.4375, 11.77734375, 12.34375, 10.91796875, 12.59765625, 14.16015625],
  [9.19921875, 13.7109375, 7.2265625, 14.5703125, 18.06640625, 8.57421875],
  [8.80859375, 12.9296875, 8.8671875, 14.140625, 17.0703125, 9.9609375],
  [8.49609375, 12.109375, 10.91796875, 12.578125, 15.078125, 12.1875],
  [8.3203125, 11.71875, 12.28515625, 11.3671875, 13.3203125, 13.84765625],
  [8.18359375, 11.54296875, 13.125, 10.5859375, 12.28515625, 14.453125],
  [9.27734375, 13.53515625, 8.65234375, 13.73046875, 16.875, 9.53125],
  [8.73046875, 12.83203125, 9.94140625, 13.4375, 16.30859375, 10.390625],
  [8.37890625, 12.03125, 11.1328125, 12.59765625, 15.13671875, 11.81640625],
  [8.203125, 11.71875, 12.34375, 11.171875, 13.4765625, 13.18359375],
  [8.18359375, 11.6796875, 13.22265625, 10.41015625, 12.24609375, 14.12109375],
  [8.90625, 12.8125, 8.45703125, 13.9453125, 17.51953125, 9.4921875],
  [8.88671875, 12.75390625, 9.2578125, 13.57421875, 16.796875, 10.29296875],
  [8.3984375, 12.36328125, 10.95703125, 12.0703125, 14.6875, 12.65625],
  [7.87109375, 11.69921875, 12.5390625, 10.37109375, 12.83203125, 14.58984375],
  [7.9296875, 11.6015625, 13.0859375, 10.41015625, 12.40234375, 14.5703125],
  [8.0859375, 11.62109375, 12.48046875, 10.76171875, 12.5, 14.08203125],
  [9.31640625, 13.69140625, 9.4921875, 12.1484375, 14.94140625, 10.859375],
  [9.1015625, 13.18359375, 10.6640625, 11.9140625, 14.55078125, 11.875],
  [8.53515625, 12.3828125, 11.46484375, 11.7578125, 13.92578125, 13.203125],
  [7.91015625, 11.66015625, 12.51953125, 10.60546875, 12.98828125, 13.984375],
  [7.83203125, 11.40625, 12.6171875, 10.625, 13.3984375, 14.0625],
  [9.62890625, 15.2734375, 14.453125, 11.11328125, 10.8984375, 12.48046875],
  [8.61328125, 11.89453125, 11.8359375, 11.6796875, 14.3359375, 13.10546875],
  [7.75390625, 10.01953125, 10.703125, 11.9921875, 15.95703125, 14.00390625],
  [6.93359375, 8.9453125, 9.609375, 12.265625, 17.5, 14.84375],
  [5.99609375, 8.3984375, 8.45703125, 12.734375, 18.10546875, 15.78125],
  [6.23046875, 9.1015625, 8.984375, 13.125, 16.9921875, 15.64453125],
  [8.57421875, 12.12890625, 12.40234375, 11.69921875, 14.1015625, 14.31640625],
  [7.67578125, 9.94140625, 10.41015625, 12.265625, 16.484375, 14.8828125],
  [6.2109375, 7.3828125, 8.046875, 13.0859375, 19.47265625, 15.64453125],
  [5.15625, 5.8984375, 6.69921875, 13.88671875, 21.328125, 16.9140625],
  [4.58984375, 5.56640625, 6.09375, 14.51171875, 21.15234375, 17.8515625],
  [5.44921875, 7.6171875, 8.0078125, 13.6328125, 18.57421875, 16.796875],
  [9.70703125, 16.6796875, 16.03515625, 10.56640625, 9.66796875, 11.6015625],
  [8.8671875, 14.4921875, 14.43359375, 10.9765625, 11.77734375, 12.8515625],
  [8.3984375, 11.015625, 12.6953125, 11.54296875, 14.53125, 13.984375],
  [7.3828125, 8.125, 10.33203125, 12.3046875, 17.32421875, 15.234375],
  [5.95703125, 6.46484375, 8.49609375, 13.4375, 19.74609375, 16.54296875],
  [4.74609375, 5.8984375, 7.34375, 14.1015625, 21.23046875, 16.69921875],
  [7.421875, 10.76171875, 12.1484375, 11.6015625, 14.98046875, 13.61328125],
  [10.6640625, 15.9375, 17.734375, 9.39453125, 9.3359375, 10.6640625],
  [10.3515625, 15.7421875, 17.5, 9.16015625, 10.0390625, 11.03515625],
  [9.47265625, 14.0625, 15.625, 9.6875, 12.59765625, 12.3828125],
  [8.49609375, 11.71875, 13.359375, 10.546875, 15.15625, 13.28125],
  [7.34375, 8.88671875, 10.83984375, 11.6015625, 18.1640625, 14.39453125],
  [8.65234375, 15.21484375, 15.15625, 10.37109375, 11.0546875, 11.0546875],
  [9.53125, 17.28515625, 17.05078125, 9.51171875, 9.51171875, 10.44921875],
  [9.82421875, 17.421875, 17.578125, 9.08203125, 9.94140625, 10.78125],
  [9.43359375, 15.25390625, 16.38671875, 9.16015625, 11.8359375, 11.4453125],
  [8.4765625, 12.55859375, 14.08203125, 10.234375, 14.0234375, 13.14453125],
  [10.0390625, 18.4375, 16.62109375, 8.73046875, 8.4765625, 9.4921875],
  [10.60546875, 20.25390625, 17.71484375, 7.890625, 7.16796875, 8.26171875],
  [10.68359375, 20.68359375, 18.0859375, 7.48046875, 7.24609375, 7.96875],
  [9.84375, 18.59375, 16.9140625, 7.890625, 9.55078125, 9.2578125],
  [9.5703125, 14.35546875, 15.78125, 8.7890625, 12.16796875, 11.2109375],
  [6.796875, 8.515625, 11.171875, 11.2109375, 18.22265625, 14.82421875],
  [7.98828125, 14.47265625, 15.390625, 10.41015625, 11.09375, 11.9921875],
  [8.14453125, 15.95703125, 16.03515625, 10, 9.62890625, 11.09375],
  [8.203125, 16.66015625, 16.54296875, 9.82421875, 9.39453125, 10.9765625],
  [8.06640625, 15.72265625, 15.859375, 9.296875, 10.83984375, 11.38671875],
  [8.14453125, 13.59375, 15.1171875, 9.51171875, 12.98828125, 12.48046875],
  [8.49609375, 10.76171875, 14.4140625, 9.39453125, 14.84375, 12.8515625],
  [8.0078125, 11.46484375, 14.375, 9.35546875, 14.70703125, 12.7734375],
  [7.8515625, 14.21875, 15.44921875, 9.23828125, 12.16796875, 11.953125],
  [8.1640625, 15.91796875, 16.484375, 9.2578125, 9.921875, 11.03515625],
  [8.28125, 16.69921875, 16.7578125, 9.4921875, 9.12109375, 10.76171875],
  [8.73046875, 17.1875, 17.34375, 9.35546875, 8.76953125, 10.41015625],
  [8.73046875, 16.77734375, 17.01171875, 9.27734375, 9.16015625, 10.390625]
];
// const data = [
//   [11.6, 12.1, 7.9, 13.2, 14.1, 7.7],
//   [11.5625, 12.0703125, 8.1640625, 13.26171875, 14.0234375, 7.75390625]
// ];
const examTypes = [
  { type: "NO", text: "No Occlusion" },
  { type: "O", text: "Occlusion" },
  { type: "EC", text: "Eyes Closed" },
  { type: "CR", text: "Custom Reading" }
];
export {
  leftPlatformCells,
  rightPlatformCells,
  leftDisplayCells,
  rightDisplayCells,
  canvasSmoothCoef,
  idealBarycenterLeftX,
  idealBarycenterRightX,
  images,
  data,
  Hz,
  pedanaWidth,
  pedanaHeight,
  examTypes
};
