const state = {
  measurements: [
    [8.75, 9.8046875, 11.4453125, 10.46875, 11.6796875, 14.94140625],
    [8.7890625, 9.90234375, 11.5234375, 10.4296875, 11.640625, 14.8828125],
    [8.828125, 9.9609375, 11.50390625, 10.37109375, 11.6015625, 14.78515625],
    [8.88671875, 10.0390625, 11.46484375, 10.37109375, 11.6015625, 14.6875],
    [8.9453125, 10.13671875, 11.40625, 10.3515625, 11.62109375, 14.6484375],
    [9.00390625, 10.17578125, 11.26953125, 10.3515625, 11.6015625, 14.51171875],
    [8.984375, 10.17578125, 11.25, 10.41015625, 11.6796875, 14.609375],
    [8.90625, 10.0390625, 11.25, 10.44921875, 11.71875, 14.7265625],
    [8.7890625, 9.86328125, 11.328125, 10.5078125, 11.7578125, 14.8828125],
    [8.73046875, 9.84375, 11.3671875, 10.5078125, 11.7578125, 15],
    [8.7109375, 9.82421875, 11.328125, 10.5078125, 11.73828125, 14.98046875],
    [8.75, 9.8828125, 11.30859375, 10.5078125, 11.73828125, 14.98046875],
    [
      8.76953125,
      9.94140625,
      11.19140625,
      10.52734375,
      11.77734375,
      14.90234375,
    ],
    [8.7890625, 9.94140625, 11.171875, 10.52734375, 11.77734375, 14.86328125],
    [8.7890625, 9.94140625, 11.2109375, 10.546875, 11.81640625, 14.90234375],
    [8.828125, 9.921875, 11.19140625, 10.52734375, 11.796875, 14.8046875],
    [8.7890625, 9.921875, 11.25, 10.5078125, 11.796875, 14.8828125],
    [8.75, 9.82421875, 11.38671875, 10.46875, 11.71875, 14.9609375],
    [8.671875, 9.78515625, 11.69921875, 10.37109375, 11.6015625, 15.09765625],
    [8.57421875, 9.8046875, 12.1484375, 10.1953125, 11.42578125, 15.01953125],
    [8.53515625, 9.765625, 12.34375, 10.09765625, 11.30859375, 14.921875],
    [8.49609375, 9.8046875, 12.44140625, 10.0390625, 11.26953125, 14.8046875],
    [8.45703125, 9.82421875, 12.44140625, 10.13671875, 11.328125, 14.84375],
    [8.49609375, 9.86328125, 12.12890625, 10.234375, 11.46484375, 14.78515625],
    [8.84765625, 10.21484375, 11.1328125, 10.625, 11.875, 14.4921875],
    [9.3359375, 10.60546875, 9.58984375, 11.875, 13.10546875, 12.5390625],
    [9.86328125, 10.9765625, 8.30078125, 13.125, 14.2578125, 9.9609375],
    [10.9375, 11.6015625, 7.1484375, 13.76953125, 14.765625, 7.9296875],
    [11.3671875, 11.89453125, 7.12890625, 13.7109375, 14.5703125, 7.578125],
    [11.5625, 12.1484375, 7.87109375, 13.2421875, 14.0625, 7.6953125],
    [11.640625, 12.1875, 8.203125, 13.125, 13.88671875, 7.8515625],
    [11.5625, 12.0703125, 8.1640625, 13.26171875, 14.0234375, 7.75390625],
    [11.5234375, 11.875, 7.83203125, 13.76953125, 14.4921875, 7.578125],
    [11.5234375, 11.69921875, 7.34375, 14.39453125, 15, 7.421875],
    [11.50390625, 11.3671875, 6.66015625, 15.01953125, 15.48828125, 7.2265625],
    [11.89453125, 11.328125, 5.8203125, 15.52734375, 15.5078125, 6.3671875],
    [12.3046875, 11.38671875, 5.56640625, 15.9765625, 15.52734375, 6.015625],
    [12.32421875, 11.2890625, 5.48828125, 16.2890625, 15.72265625, 6.09375],
    [11.7578125, 10.6640625, 5, 16.81640625, 16.15234375, 6.30859375],
    [11.26953125, 10.17578125, 4.609375, 17.16796875, 16.4453125, 6.2890625],
    [11.6015625, 10.3125, 4.921875, 17.32421875, 16.58203125, 6.1328125],
    [11.6796875, 10.15625, 4.78515625, 17.32421875, 16.54296875, 5.8203125],
    [10.6640625, 9.16015625, 3.76953125, 18.359375, 17.5, 6.30859375],
    [9.51171875, 7.9296875, 2.71484375, 19.6875, 18.53515625, 6.34765625],
    [8.22265625, 6.85546875, 2.1875, 20.859375, 19.31640625, 6.4453125],
    [7.59765625, 6.5625, 2.12890625, 21.34765625, 19.78515625, 6.8359375],
    [7.96875, 7.01171875, 2.44140625, 20.72265625, 19.43359375, 6.69921875],
    [8.73046875, 7.59765625, 2.79296875, 20.2734375, 19.21875, 6.640625],
    [8.7890625, 7.578125, 2.67578125, 20.0390625, 19.140625, 6.40625],
    [8.73046875, 7.5, 2.51953125, 20.13671875, 19.27734375, 6.2890625],
    [8.5546875, 7.3828125, 2.48046875, 20.33203125, 19.51171875, 6.42578125],
    [8.30078125, 7.2265625, 2.5, 20.46875, 19.6484375, 6.77734375],
    [8.06640625, 7.05078125, 2.578125, 20.44921875, 19.6484375, 7.20703125],
    [7.9296875, 6.9140625, 2.79296875, 20.2734375, 19.62890625, 7.55859375],
    [7.67578125, 6.66015625, 2.94921875, 20.4296875, 19.86328125, 7.890625],
    [7.16796875, 6.19140625, 2.79296875, 20.95703125, 20.41015625, 8.0859375],
    [6.89453125, 5.9375, 2.5390625, 21.38671875, 20.703125, 8.02734375],
    [6.9921875, 6.03515625, 2.5390625, 21.6796875, 20.8984375, 7.98828125],
    [6.875, 5.9375, 2.4609375, 22.12890625, 21.171875, 7.94921875],
    [6.54296875, 5.6640625, 2.109375, 22.8125, 21.62109375, 7.7734375],
    [6.42578125, 5.56640625, 1.93359375, 23.2421875, 21.93359375, 7.65625],
    [6.19140625, 5.37109375, 1.85546875, 23.14453125, 22.12890625, 7.8515625],
    [5.72265625, 5, 1.73828125, 23.671875, 22.79296875, 8.61328125],
    [4.90234375, 4.296875, 1.40625, 24.1796875, 23.53515625, 9.04296875],
    [4.0625, 3.57421875, 1.19140625, 24.82421875, 24.39453125, 9.31640625],
    [3.61328125, 3.2421875, 1.11328125, 25.1171875, 24.86328125, 9.27734375],
    [3.7109375, 3.33984375, 1.23046875, 25.078125, 24.78515625, 9.1796875],
    [4.00390625, 3.73046875, 1.38671875, 24.7265625, 24.4140625, 9.4140625],
    [4.296875, 4.140625, 1.6015625, 24.23828125, 23.92578125, 9.66796875],
    [4.8828125, 4.765625, 1.89453125, 23.4765625, 23.33984375, 9.55078125],
    [4.8828125, 4.7265625, 1.97265625, 23.203125, 23.0859375, 9.82421875],
    [4.6875, 4.47265625, 1.89453125, 22.96875, 23.10546875, 10.2734375],
    [4.47265625, 4.296875, 1.9921875, 22.75390625, 23.3203125, 11.015625],
    [4.08203125, 3.9453125, 1.85546875, 22.44140625, 23.69140625, 11.6796875],
    [3.80859375, 3.69140625, 1.7578125, 22.5, 23.8671875, 12.20703125],
    [3.3984375, 3.30078125, 1.5234375, 22.65625, 24.08203125, 12.7734375],
    [2.94921875, 2.87109375, 1.40625, 22.578125, 23.96484375, 13.84765625],
    [2.67578125, 2.63671875, 1.71875, 21.23046875, 23.0859375, 16.15234375],
    [2.4609375, 2.34375, 1.5625, 20.33203125, 22.5390625, 17.12890625],
    [2.48046875, 2.3828125, 1.4453125, 20.87890625, 22.8125, 16.4453125],
    [3.203125, 2.91015625, 1.953125, 21.015625, 22.98828125, 13.4375],
    [3.59375, 3.14453125, 2.265625, 20.48828125, 22.890625, 12.83203125],
    [2.96875, 2.6171875, 1.6796875, 20.52734375, 22.7734375, 14.31640625],
    [2.71484375, 2.48046875, 1.58203125, 20.625, 22.51953125, 15.25390625],
    [2.91015625, 2.59765625, 2.01171875, 20.234375, 22.34375, 15.64453125],
    [3.0078125, 2.7734375, 2.20703125, 19.98046875, 21.71875, 15.3515625],
    [3.3203125, 3.18359375, 2.36328125, 19.98046875, 21.30859375, 15.0390625],
    [3.41796875, 3.3984375, 2.24609375, 20.078125, 21.03515625, 14.7265625],
    [3.49609375, 3.3203125, 2.3828125, 20.17578125, 21.171875, 14.74609375],
    [3.203125, 2.91015625, 2.28515625, 20.83984375, 23.53515625, 16.19140625],
    [1.66015625, 1.34765625, 0.72265625, 19.74609375, 23.75, 15.64453125],
    [1.40625, 1.50390625, 0.68359375, 20.29296875, 22.40234375, 17.65625],
    [1.5625, 2.0703125, 0.80078125, 20.3125, 22.5, 16.50390625],
    [2.83203125, 3.10546875, 2.34375, 20.234375, 21.97265625, 16.85546875],
    [4.04296875, 4.74609375, 4.3359375, 18.75, 19.43359375, 15.83984375],
    [6.2890625, 7.0703125, 8.1640625, 16.1328125, 16.2109375, 13.515625],
    [7.9296875, 8.359375, 10.8203125, 14.39453125, 14.70703125, 11.58203125],
    [8.8671875, 8.671875, 11.77734375, 13.33984375, 13.22265625, 10.4296875],
    [9.08203125, 8.80859375, 12.0703125, 12.7734375, 12.83203125, 10.078125],
    [9.453125, 9.27734375, 11.85546875, 12.51953125, 12.63671875, 10.078125],
    [9.6484375, 9.23828125, 11.85546875, 12.3046875, 12.578125, 10.2734375],
    [9.4921875, 9.04296875, 11.5234375, 12.20703125, 13.14453125, 10.87890625],
    [9.5703125, 9.84375, 11.30859375, 12.2265625, 12.87109375, 10.546875],
    [10.17578125, 10.4296875, 11.953125, 11.73828125, 12.24609375, 10.41015625],
    [9.7265625, 10.1171875, 12.109375, 11.2890625, 12.0703125, 11.875],
    [9.23828125, 9.58984375, 12.48046875, 10.60546875, 11.4453125, 13.26171875],
    [9.27734375, 9.5703125, 12.79296875, 10.4296875, 11.15234375, 13.4765625],
    [8.9453125, 9.31640625, 12.5390625, 10.3125, 11.03515625, 13.90625],
    [8.7109375, 9.12109375, 12.5390625, 10.13671875, 10.99609375, 14.66796875],
    [8.49609375, 8.90625, 12.6953125, 9.86328125, 10.91796875, 15.41015625],
    [8.30078125, 8.75, 13.1640625, 9.55078125, 10.6640625, 16.07421875],
    [8.28125, 8.75, 13.4765625, 9.453125, 10.41015625, 16.40625],
    [8.4765625, 8.96484375, 14.1015625, 9.1796875, 9.8046875, 16.15234375],
    [8.7109375, 9.1796875, 15.09765625, 8.828125, 9.19921875, 16.015625],
    [8.75, 9.1796875, 15.37109375, 8.7109375, 8.984375, 16.015625],
    [8.65234375, 9.0625, 15.25390625, 8.7890625, 9.00390625, 16.25],
    [8.53515625, 9.00390625, 15.17578125, 8.88671875, 9.1015625, 16.50390625],
    [8.33984375, 8.84765625, 14.82421875, 8.984375, 9.16015625, 16.69921875],
    [8.125, 8.73046875, 14.55078125, 9.08203125, 9.296875, 17.0703125],
    [7.79296875, 8.4765625, 13.984375, 9.2578125, 9.4921875, 17.4609375],
    [7.59765625, 8.33984375, 13.65234375, 9.3359375, 9.58984375, 17.87109375],
    [7.4609375, 8.2421875, 13.515625, 9.31640625, 9.53125, 18.02734375],
    [7.265625, 8.06640625, 13.53515625, 9.21875, 9.453125, 18.359375],
    [7.1484375, 7.96875, 13.6328125, 9.23828125, 9.4921875, 18.7109375],
    [7.2265625, 7.87109375, 13.76953125, 9.2578125, 9.453125, 18.88671875],
    [7.40234375, 7.96875, 13.90625, 9.1796875, 9.43359375, 18.80859375],
    [7.421875, 8.06640625, 13.90625, 9.296875, 9.55078125, 18.3984375],
    [7.51953125, 8.18359375, 13.4375, 9.296875, 9.98046875, 17.40234375],
    [7.71484375, 8.49609375, 13.61328125, 9.16015625, 10.05859375, 16.953125],
    [7.65625, 8.4375, 13.61328125, 8.984375, 9.9609375, 16.9140625],
    [7.51953125, 8.22265625, 13.61328125, 9.1015625, 9.98046875, 17.578125],
    [7.20703125, 7.83203125, 13.45703125, 9.16015625, 10.09765625, 18.37890625],
    [6.97265625, 7.5, 13.26171875, 9.19921875, 10.078125, 18.7890625],
    [7.03125, 7.40234375, 13.28125, 9.35546875, 10.05859375, 19.2578125],
    [6.97265625, 7.265625, 13.45703125, 9.23828125, 9.90234375, 19.4140625],
    [7.01171875, 7.16796875, 13.65234375, 9.27734375, 9.765625, 19.6484375],
    [7.05078125, 7.109375, 13.75, 9.2578125, 9.6875, 19.5703125],
    [7.1484375, 7.16796875, 13.53515625, 9.375, 9.7265625, 19.31640625],
    [7.28515625, 7.1875, 13.37890625, 9.4921875, 9.82421875, 19.4140625],
    [7.20703125, 7.08984375, 13.2421875, 9.4921875, 9.8046875, 19.39453125],
    [7.3046875, 7.12890625, 13.3984375, 9.53125, 9.84375, 19.375],
    [7.36328125, 7.1875, 13.57421875, 9.39453125, 9.70703125, 19.12109375],
    [7.5, 7.28515625, 13.76953125, 9.375, 9.6875, 18.9453125],
    [7.36328125, 7.20703125, 13.5546875, 9.51171875, 9.84375, 19.16015625],
    [6.9921875, 6.796875, 12.7734375, 9.8828125, 10.25390625, 19.8046875],
    [6.6015625, 6.42578125, 11.62109375, 10.234375, 11.09375, 20.52734375],
    [6.6796875, 6.58203125, 11.171875, 10.234375, 11.30859375, 20.25390625],
    [7.16796875, 7.2265625, 11.3671875, 10.078125, 11.23046875, 18.828125],
    [7.8515625, 8.1640625, 12.3828125, 9.86328125, 10.64453125, 16.9921875],
    [8.828125, 9.23828125, 13.671875, 9.35546875, 9.82421875, 15.0390625],
    [10.078125, 10.56640625, 15.25390625, 8.515625, 8.73046875, 12.9296875],
    [11.19140625, 11.796875, 16.97265625, 7.63671875, 7.5390625, 10.95703125],
    [12.34375, 13.4765625, 18.7890625, 6.5234375, 6.15234375, 8.7890625],
    [13.33984375, 15, 19.58984375, 5.72265625, 5.1953125, 7.265625],
    [14.1796875, 16.015625, 20.37109375, 5.01953125, 4.3359375, 6.03515625],
    [14.4921875, 16.69921875, 21.0546875, 4.296875, 3.45703125, 4.94140625],
    [14.58984375, 16.9921875, 21.2890625, 4.04296875, 3.046875, 4.66796875],
    [14.8828125, 17.9296875, 21.0546875, 4.0234375, 2.8125, 4.4921875],
    [15.1171875, 18.5546875, 20.9765625, 3.73046875, 2.51953125, 4.00390625],
    [15.33203125, 18.8671875, 20.83984375, 3.59375, 2.40234375, 3.61328125],
    [15.33203125, 19.04296875, 20.234375, 3.828125, 2.6171875, 3.671875],
    [15.1953125, 19.19921875, 19.51171875, 4.08203125, 2.87109375, 3.7890625],
    [15.37109375, 19.53125, 19.04296875, 4.1015625, 2.87109375, 3.57421875],
    [15.46875, 19.43359375, 18.7109375, 4.08203125, 2.87109375, 3.3984375],
    [15.44921875, 19.453125, 18.203125, 4.0625, 3.0078125, 3.18359375],
    [15.80078125, 20.2734375, 18.5546875, 3.76953125, 2.71484375, 2.44140625],
    [15.78125, 20.87890625, 18.4765625, 3.65234375, 2.578125, 2.1875],
    [16.07421875, 21.03515625, 18.49609375, 3.49609375, 2.5, 1.953125],
    [16.0546875, 20.60546875, 18.359375, 3.37890625, 2.44140625, 1.85546875],
    [15.8203125, 19.9609375, 18.14453125, 3.69140625, 2.67578125, 2.3046875],
    [15.33203125, 19.19921875, 17.91015625, 3.9453125, 2.98828125, 2.75390625],
    [15.2734375, 19.16015625, 18.203125, 4.1015625, 3.125, 2.9296875],
    [15.2734375, 19.375, 18.3984375, 3.9453125, 3.06640625, 2.75390625],
    [15.33203125, 19.39453125, 18.53515625, 3.7890625, 3.02734375, 2.6171875],
    [15.37109375, 19.31640625, 18.59375, 3.80859375, 3.046875, 2.65625],
    [15.1171875, 19.19921875, 18.5546875, 3.984375, 3.203125, 3.046875],
    [14.84375, 19.0234375, 18.3203125, 4.19921875, 3.359375, 3.4375],
    [14.6484375, 18.69140625, 18.22265625, 4.4921875, 3.828125, 3.76953125],
    [14.16015625, 17.94921875, 17.890625, 4.86328125, 4.31640625, 4.1796875],
    [13.37890625, 16.85546875, 17.1484375, 5.46875, 5.13671875, 5.078125],
    [12.265625, 15.09765625, 15.9375, 6.42578125, 6.38671875, 6.66015625],
    [11.328125, 13.30078125, 14.94140625, 7.51953125, 7.59765625, 8.4375],
    [9.53125, 10.3515625, 12.890625, 9.51171875, 9.39453125, 11.71875],
    [8.1640625, 8.57421875, 11.26953125, 11.2109375, 10.7421875, 14.27734375],
    [7.265625, 7.265625, 10.1953125, 12.265625, 11.7578125, 16.03515625],
    [6.19140625, 5.91796875, 8.41796875, 13.37890625, 12.94921875, 18.1640625],
    [5.5859375, 5.2734375, 7.5, 14.1015625, 13.88671875, 19.0234375],
    [5.01953125, 4.82421875, 6.8359375, 14.62890625, 14.82421875, 19.70703125],
    [4.375, 4.1015625, 6.015625, 15.3125, 15.56640625, 20.76171875],
    [3.75, 3.359375, 5.05859375, 15.625, 16.015625, 21.69921875],
    [3.7109375, 3.30078125, 4.70703125, 15.4296875, 16.015625, 22.109375],
    [3.69140625, 2.7734375, 4.4140625, 15.56640625, 16.2890625, 22.59765625],
    [3.359375, 2.48046875, 4.00390625, 15.80078125, 16.4453125, 23.22265625],
    [3.203125, 2.40234375, 3.828125, 15.87890625, 16.46484375, 23.5546875],
    [3.0078125, 2.421875, 3.69140625, 15.95703125, 16.40625, 23.65234375],
    [2.98828125, 2.67578125, 3.828125, 15.95703125, 16.171875, 23.4765625],
    [3.10546875, 3.0859375, 4.0625, 15.8984375, 15.95703125, 23.359375],
    [3.1640625, 3.41796875, 4.31640625, 15.8203125, 15.56640625, 23.26171875],
    [3.4375, 3.84765625, 4.86328125, 15.6640625, 15.13671875, 22.94921875],
    [4.04296875, 4.53125, 5.91796875, 15, 14.6875, 22.12890625],
    [4.921875, 5.46875, 6.89453125, 14.140625, 13.96484375, 21.0546875],
    [5.48828125, 6.015625, 7.2265625, 13.76953125, 13.6328125, 20.234375],
    [5.91796875, 6.40625, 7.3046875, 13.6328125, 13.75, 18.65234375],
    [6.58203125, 6.953125, 7.421875, 13.9453125, 14.08203125, 16.11328125],
    [7.28515625, 7.59765625, 7.109375, 14.58984375, 14.66796875, 13.61328125],
    [8.0078125, 8.26171875, 6.34765625, 15.3515625, 15.2734375, 10.83984375],
    [8.4375, 8.6328125, 5.87890625, 15.83984375, 15.60546875, 9.21875],
    [8.76953125, 8.88671875, 5.80078125, 15.99609375, 15.76171875, 8.30078125],
    [9.0234375, 8.80859375, 5.68359375, 16.1328125, 15.9765625, 7.65625],
    [9.08203125, 8.37890625, 5.25390625, 16.62109375, 16.4453125, 7.109375],
    [8.69140625, 7.44140625, 4.39453125, 17.8125, 17.59765625, 6.953125],
    [8.06640625, 6.8359375, 3.65234375, 18.73046875, 18.41796875, 6.875],
    [7.63671875, 6.77734375, 3.4375, 18.984375, 18.671875, 7.32421875],
    [7.36328125, 6.81640625, 3.59375, 19.21875, 18.90625, 7.44140625],
    [7.01171875, 6.328125, 3.7109375, 19.39453125, 19.23828125, 6.8359375],
    [5.8984375, 5.25390625, 3.3203125, 19.8828125, 19.78515625, 6.8359375],
    [4.921875, 4.19921875, 2.734375, 20.68359375, 20.64453125, 7.1484375],
    [3.84765625, 3.4375, 2.3046875, 21.171875, 21.2890625, 7.5],
    [3.6328125, 3.26171875, 2.65625, 21.23046875, 21.5234375, 8.18359375],
    [3.57421875, 3.26171875, 3.02734375, 21.11328125, 21.73828125, 9.66796875],
    [3.18359375, 2.8125, 2.65625, 21.15234375, 22.2265625, 11.484375],
    [2.71484375, 2.32421875, 2.12890625, 21.5625, 22.9296875, 12.8515625],
    [2.109375, 1.640625, 1.5625, 21.9921875, 23.75, 13.59375],
    [1.89453125, 1.3671875, 1.5234375, 22.12890625, 24.1015625, 13.984375],
    [1.5234375, 1.2109375, 1.34765625, 22.01171875, 24.0625, 14.453125],
    [1.40625, 1.34765625, 1.46484375, 21.2890625, 23.1640625, 15.3515625],
    [1.85546875, 1.8359375, 2.265625, 20.48828125, 22.40234375, 16.4453125],
    [2.12890625, 1.9140625, 2.71484375, 19.66796875, 21.9921875, 16.71875],
    [2.1875, 1.97265625, 2.890625, 19.47265625, 21.89453125, 17.20703125],
    [2.16796875, 1.97265625, 2.94921875, 18.7890625, 21.50390625, 18.33984375],
    [2.265625, 2.2265625, 3.203125, 17.79296875, 20.46875, 19.08203125],
    [2.8515625, 2.8515625, 4.2578125, 16.77734375, 19.4921875, 19.609375],
    [3.5546875, 3.4765625, 5.46875, 15.41015625, 17.890625, 20.390625],
    [4.08203125, 4.140625, 6.42578125, 14.27734375, 16.58203125, 20.80078125],
    [4.3359375, 4.53125, 7.0703125, 13.4375, 15.5078125, 21.40625],
    [4.921875, 5.37109375, 8.2421875, 12.5, 14.19921875, 21.54296875],
    [5.56640625, 6.19140625, 9.3359375, 11.85546875, 13.06640625, 21.03515625],
    [6.015625, 6.81640625, 10.13671875, 11.46484375, 11.9921875, 20.3125],
    [7.109375, 8.1640625, 11.875, 10.52734375, 10.5078125, 18.61328125],
    [8.7109375, 10.8984375, 14.66796875, 8.73046875, 7.91015625, 15.25390625],
    [10.52734375, 14.00390625, 17.6171875, 6.796875, 5.8203125, 11.30859375],
    [12.109375, 15.29296875, 19.82421875, 5.625, 4.8828125, 8.69140625],
    [12.79296875, 15.78125, 20.91796875, 4.94140625, 4.296875, 6.93359375],
    [12.890625, 16.0546875, 20.8984375, 5.05859375, 4.296875, 6.50390625],
    [13.06640625, 16.77734375, 20.21484375, 4.9609375, 4.19921875, 6.11328125],
    [13.8671875, 18.33984375, 19.53125, 4.35546875, 3.6328125, 5.21484375],
    [14.55078125, 19.4140625, 19.4140625, 3.8671875, 3.203125, 4.31640625],
    [15.44921875, 20.91796875, 18.53515625, 3.4765625, 2.890625, 3.10546875],
    [16.5234375, 22.5390625, 16.6796875, 3.2421875, 2.75390625, 2.36328125],
    [17.7734375, 23.984375, 15.390625, 2.91015625, 2.65625, 1.8359375],
    [18.4765625, 24.35546875, 15.09765625, 2.63671875, 2.5390625, 1.484375],
    [18.28125, 23.828125, 14.6875, 2.65625, 2.63671875, 1.40625],
    [18.0078125, 23.4765625, 14.39453125, 2.96875, 2.94921875, 1.796875],
    [18.515625, 23.41796875, 14.296875, 3.0078125, 2.96875, 2.08984375],
    [18.9453125, 23.4765625, 13.3984375, 2.91015625, 2.9296875, 1.953125],
    [19.3359375, 23.65234375, 12.59765625, 3.02734375, 3.10546875, 1.9140625],
    [19.66796875, 23.7109375, 12.05078125, 3.2421875, 3.18359375, 1.73828125],
    [20.33203125, 23.515625, 11.66015625, 3.515625, 3.359375, 1.5625],
    [20.41015625, 23.02734375, 11.34765625, 3.7890625, 3.80859375, 1.71875],
    [19.9609375, 22.03125, 10.64453125, 4.27734375, 4.19921875, 1.69921875],
    [19.43359375, 20.80078125, 11.15234375, 5.546875, 4.70703125, 2.91015625],
    [18.06640625, 18.4765625, 11.03515625, 5.8203125, 5.72265625, 2.9296875],
    [17.48046875, 16.62109375, 11.03515625, 6.54296875, 6.7578125, 4.00390625],
    [17.0703125, 15.9765625, 11.171875, 6.69921875, 6.8359375, 4.296875],
    [17.421875, 15.80078125, 12.3828125, 5.9375, 5.8203125, 4.04296875],
    [17.7734375, 16.015625, 13.88671875, 5.17578125, 4.84375, 3.73046875],
    [17.83203125, 16.09375, 14.3359375, 4.765625, 4.4140625, 3.5546875],
    [17.96875, 16.81640625, 14.5703125, 4.51171875, 4.08203125, 3.18359375],
    [18.671875, 18.18359375, 14.3359375, 3.984375, 3.45703125, 2.48046875],
    [19.31640625, 18.65234375, 14.9609375, 3.53515625, 3.0078125, 2.24609375],
    [18.69140625, 18.88671875, 15.3515625, 3.515625, 3.3203125, 2.40234375],
    [18.14453125, 18.2421875, 15.37109375, 3.7109375, 3.671875, 2.63671875],
    [17.3046875, 17.578125, 15.33203125, 4.609375, 4.4921875, 3.73046875],
    [16.15234375, 16.3671875, 14.7265625, 5.5859375, 5.52734375, 5.15625],
    [14.74609375, 15.01953125, 13.92578125, 6.7578125, 6.81640625, 6.9140625],
    [13.73046875, 14.16015625, 13.4765625, 7.890625, 8.046875, 8.65234375],
    [13.30078125, 14.0625, 13.57421875, 8.02734375, 8.22265625, 8.8671875],
    [13.0078125, 14.08203125, 14.21875, 7.87109375, 8.1640625, 8.75],
    [12.5, 13.6328125, 14.4921875, 7.87109375, 8.26171875, 9.08203125],
    [11.50390625, 12.8125, 14.6484375, 8.14453125, 8.49609375, 10.25390625],
    [10.78125, 11.640625, 15.078125, 8.59375, 8.96484375, 11.7578125],
    [10.46875, 11.1328125, 14.3359375, 8.984375, 9.27734375, 12.44140625],
    [10.41015625, 11.171875, 12.7734375, 9.82421875, 10.0390625, 12.98828125],
    [10.4296875, 11.34765625, 11.26953125, 10.44921875, 10.859375, 13.02734375],
    [10.33203125, 11.30859375, 10.3125, 10.8203125, 11.30859375, 13.125],
    [10.3515625, 11.07421875, 9.74609375, 11.09375, 11.4453125, 13.0078125],
    [10.3125, 10.859375, 9.55078125, 11.15234375, 11.484375, 12.9296875],
    [10.2734375, 11.11328125, 10.625, 11.09375, 11.54296875, 13.45703125],
    [10.2734375, 10.87890625, 11.328125, 10.3125, 10.87890625, 13.14453125],
    [10.13671875, 10.625, 11.46484375, 10.4296875, 10.99609375, 13.84765625],
    [9.74609375, 10.1171875, 10.44921875, 10.80078125, 11.40625, 14.609375],
    [9.39453125, 9.78515625, 9.51171875, 11.34765625, 11.97265625, 15.17578125],
    [9.2578125, 9.609375, 8.92578125, 11.73828125, 12.3046875, 15.15625],
    [9.140625, 9.47265625, 8.8671875, 11.953125, 12.48046875, 15.17578125],
    [8.84765625, 9.1796875, 8.73046875, 12.1484375, 12.63671875, 15.5859375],
    [8.4765625, 8.80859375, 9.19921875, 12.1484375, 12.63671875, 16.0546875],
    [8.30078125, 8.65234375, 9.3359375, 12.08984375, 12.5390625, 16.25],
    [8.41796875, 8.75, 9.4140625, 12.08984375, 12.578125, 16.328125],
    [8.5546875, 8.84765625, 9.140625, 12.08984375, 12.51953125, 16.03515625],
    [8.7109375, 9.0234375, 8.9453125, 12.1875, 12.578125, 15.8203125],
    [8.90625, 9.27734375, 8.73046875, 12.265625, 12.55859375, 15.390625],
    [9.19921875, 9.58984375, 9.08203125, 12.08984375, 12.34375, 14.82421875],
    [9.5703125, 10.09765625, 9.765625, 11.66015625, 11.93359375, 14.08203125],
    [9.84375, 10.46875, 10.234375, 11.2890625, 11.5625, 13.53515625],
    [10, 10.625, 10.5859375, 11.03515625, 11.34765625, 13.359375],
    [
      10.234375,
      10.83984375,
      10.52734375,
      10.91796875,
      11.23046875,
      13.18359375,
    ],
    [10.546875, 11.09375, 10.0390625, 11.03515625, 11.34765625, 12.94921875],
    [10.56640625, 11.09375, 9.6875, 11.26953125, 11.5625, 12.79296875],
    [10.41015625, 10.95703125, 9.6484375, 11.328125, 11.640625, 12.91015625],
    [10.4296875, 11.015625, 9.39453125, 11.640625, 11.9140625, 12.71484375],
    [10.48828125, 11.11328125, 8.80859375, 11.97265625, 12.12890625, 12.34375],
    [10.46875, 11.015625, 8.76953125, 12.08984375, 12.24609375, 12.40234375],
    [10.37109375, 10.95703125, 8.359375, 12.36328125, 12.5390625, 12.28515625],
    [10.4296875, 10.87890625, 8.0078125, 12.734375, 12.83203125, 12.109375],
    [10.44921875, 10.72265625, 7.83203125, 13.046875, 13.0859375, 11.9140625],
    [
      10.37109375,
      10.5859375,
      7.75390625,
      13.33984375,
      13.33984375,
      11.73828125,
    ],
    [10.3125, 10.546875, 7.75390625, 13.41796875, 13.37890625, 11.54296875],
    [10.4296875, 10.72265625, 8.046875, 13.30078125, 13.203125, 11.5234375],
    [10.5859375, 10.91796875, 8.4375, 12.98828125, 12.9296875, 11.42578125],
    [10.6640625, 11.015625, 8.65234375, 12.63671875, 12.6953125, 11.38671875],
    [10.78125, 11.1328125, 9.04296875, 12.1484375, 12.3046875, 11.23046875],
    [10.8984375, 11.23046875, 9.453125, 11.81640625, 12.03125, 11.2109375],
    [11.11328125, 11.38671875, 10.09765625, 11.46484375, 11.71875, 11.19140625],
    [11.23046875, 11.5234375, 10.2734375, 11.42578125, 11.640625, 11.19140625],
    [11.328125, 11.66015625, 10.3125, 11.26953125, 11.46484375, 10.91796875],
    [11.46484375, 11.796875, 10.390625, 11.19140625, 11.25, 10.5859375],
    [11.5625, 11.9140625, 10.56640625, 11.09375, 11.11328125, 10.48828125],
    [11.6796875, 12.109375, 10.9375, 10.99609375, 11.11328125, 10.56640625],
    [12.20703125, 12.578125, 11.42578125, 10.56640625, 10.64453125, 9.90234375],
    [12.55859375, 12.91015625, 11.40625, 10.48828125, 10.46875, 9.47265625],
    [12.59765625, 12.98828125, 11.03515625, 10.6640625, 10.390625, 9.16015625],
    [12.734375, 13.18359375, 11.0546875, 10.6640625, 10.390625, 8.96484375],
  ],
  currentMeasurment: [11.6, 12.1, 7.9, 13.2, 14.1, 7.7],
};
const getters = {
  leftWeights: state => state.currentMeasurment.slice(0, 3),
  rightWeights: state => state.currentMeasurment.slice(3, 6)
};
export default {
  state,
  getters,
  namespaced: true,
};
