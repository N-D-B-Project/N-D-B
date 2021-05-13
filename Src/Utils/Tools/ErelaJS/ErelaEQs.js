module.exports = (client) => {
    client.defaultEQ = [{
        band: 0,
        gain: 0.25
      },
      {
        band: 1,
        gain: 0.025
      },
      {
        band: 2,
        gain: 0.0125
      },
      {
        band: 3,
        gain: 0
      },
      {
        band: 4,
        gain: 0
      },
      {
        band: 5,
        gain: -0.0125
      },
      {
        band: 6,
        gain: -0.025
      },
      {
        band: 7,
        gain: -0.0175
      },
      {
        band: 8,
        gain: 0
      },
      {
        band: 9,
        gain: 0
      },
      {
        band: 10,
        gain: 0.0125
      },
      {
        band: 11,
        gain: 0.025
      },
      {
        band: 12,
        gain: 0.25
      },
      {
        band: 13,
        gain: 0.125
      },
      {
        band: 14,
        gain: 0.125
      },
    ];
    client.bassboost = {
      none: client.defaultEQ,
      low: [{
          band: 0,
          gain: 0.0625
        },
        {
          band: 1,
          gain: 0.125
        },
        {
          band: 2,
          gain: -0.125
        },
        {
          band: 3,
          gain: -0.0625
        },
        {
          band: 4,
          gain: 0
        },
        {
          band: 5,
          gain: -0.0125
        },
        {
          band: 6,
          gain: -0.025
        },
        {
          band: 7,
          gain: -0.0175
        },
        {
          band: 8,
          gain: 0
        },
        {
          band: 9,
          gain: 0
        },
        {
          band: 10,
          gain: 0.0125
        },
        {
          band: 11,
          gain: 0.025
        },
        {
          band: 12,
          gain: 0.375
        },
        {
          band: 13,
          gain: 0.125
        },
        {
          band: 14,
          gain: 0.125
        },
      ],
      medium: [{
          band: 0,
          gain: 0.125
        },
        {
          band: 1,
          gain: 0.25
        },
        {
          band: 2,
          gain: -0.25
        },
        {
          band: 3,
          gain: -0.125
        },
        {
          band: 4,
          gain: 0
        },
        {
          band: 5,
          gain: -0.0125
        },
        {
          band: 6,
          gain: -0.025
        },
        {
          band: 7,
          gain: -0.0175
        },
        {
          band: 8,
          gain: 0
        },
        {
          band: 9,
          gain: 0
        },
        {
          band: 10,
          gain: 0.0125
        },
        {
          band: 11,
          gain: 0.025
        },
        {
          band: 12,
          gain: 0.375
        },
        {
          band: 13,
          gain: 0.125
        },
        {
          band: 14,
          gain: 0.125
        },
      ],
      high: [{
          band: 0,
          gain: 0.1875
        },
        {
          band: 1,
          gain: 0.375
        },
        {
          band: 2,
          gain: -0.375
        },
        {
          band: 3,
          gain: -0.1875
        },
        {
          band: 4,
          gain: 0
        },
        {
          band: 5,
          gain: -0.0125
        },
        {
          band: 6,
          gain: -0.025
        },
        {
          band: 7,
          gain: -0.0175
        },
        {
          band: 8,
          gain: 0
        },
        {
          band: 9,
          gain: 0
        },
        {
          band: 10,
          gain: 0.0125
        },
        {
          band: 11,
          gain: 0.025
        },
        {
          band: 12,
          gain: 0.375
        },
        {
          band: 13,
          gain: 0.125
        },
        {
          band: 14,
          gain: 0.125
        },
      ],
      earrape: [{
          band: 0,
          gain: 0.25
        },
        {
          band: 1,
          gain: 0.5
        },
        {
          band: 2,
          gain: -0.5
        },
        {
          band: 3,
          gain: -0.25
        },
        {
          band: 4,
          gain: 0
        },
        {
          band: 5,
          gain: -0.0125
        },
        {
          band: 6,
          gain: -0.025
        },
        {
          band: 7,
          gain: -0.0175
        },
        {
          band: 8,
          gain: 0
        },
        {
          band: 9,
          gain: 0
        },
        {
          band: 10,
          gain: 0.0125
        },
        {
          band: 11,
          gain: 0.025
        },
        {
          band: 12,
          gain: 0.375
        },
        {
          band: 13,
          gain: 0.125
        },
        {
          band: 14,
          gain: 0.125
        },
      ],
    };
    client.eqs = {
      music: client.defaultEQ,
      pop: [{
          band: 0,
          gain: -0.200
        },
        {
          band: 1,
          gain: -0.100
        },
        {
          band: 2,
          gain: 0
        },
        {
          band: 3,
          gain: 0.100
        },
        {
          band: 4,
          gain: 0.150
        },
        {
          band: 5,
          gain: 0.250
        },
        {
          band: 6,
          gain: 0.300
        },
        {
          band: 7,
          gain: 0.350
        },
        {
          band: 8,
          gain: 0.300
        },
        {
          band: 9,
          gain: 0.250
        },
        {
          band: 10,
          gain: 0.150
        },
        {
          band: 11,
          gain: 0.100
        },
        {
          band: 12,
          gain: 0
        },
        {
          band: 13,
          gain: -0.100
        },
        {
          band: 14,
          gain: -0.200
        },
      ],
      electronic: [{
          band: 0,
          gain: 0.375
        },
        {
          band: 1,
          gain: 0.350
        },
        {
          band: 2,
          gain: 0.125
        },
        {
          band: 3,
          gain: 0
        },
        {
          band: 4,
          gain: 0
        },
        {
          band: 5,
          gain: -0.125
        },
        {
          band: 6,
          gain: -0.125
        },
        {
          band: 7,
          gain: 0
        },
        {
          band: 8,
          gain: 0.25
        },
        {
          band: 9,
          gain: 0.125
        },
        {
          band: 10,
          gain: 0.15
        },
        {
          band: 11,
          gain: 0.2
        },
        {
          band: 12,
          gain: 0.250
        },
        {
          band: 13,
          gain: 0.350
        },
        {
          band: 14,
          gain: 0.400
        },
      ],
      classical: [{
          band: 0,
          gain: 0.375
        },
        {
          band: 1,
          gain: 0.350
        },
        {
          band: 2,
          gain: 0.125
        },
        {
          band: 3,
          gain: 0
        },
        {
          band: 4,
          gain: 0
        },
        {
          band: 5,
          gain: 0.125
        },
        {
          band: 6,
          gain: 0.550
        },
        {
          band: 7,
          gain: 0.050
        },
        {
          band: 8,
          gain: 0.125
        },
        {
          band: 9,
          gain: 0.250
        },
        {
          band: 10,
          gain: 0.200
        },
        {
          band: 11,
          gain: 0.250
        },
        {
          band: 12,
          gain: 0.300
        },
        {
          band: 13,
          gain: 0.250
        },
        {
          band: 14,
          gain: 0.300
        },
      ],
      rock: [{
          band: 0,
          gain: 0.300
        },
        {
          band: 1,
          gain: 0.250
        },
        {
          band: 2,
          gain: 0.200
        },
        {
          band: 3,
          gain: 0.100
        },
        {
          band: 4,
          gain: 0.050
        },
        {
          band: 5,
          gain: -0.050
        },
        {
          band: 6,
          gain: -0.150
        },
        {
          band: 7,
          gain: -0.200
        },
        {
          band: 8,
          gain: -0.100
        },
        {
          band: 9,
          gain: -0.050
        },
        {
          band: 10,
          gain: 0.050
        },
        {
          band: 11,
          gain: 0.100
        },
        {
          band: 12,
          gain: 0.200
        },
        {
          band: 13,
          gain: 0.250
        },
        {
          band: 14,
          gain: 0.300
        },
      ],

      full: [{
          band: 0,
          gain: 0.25 + 0.375
        },
        {
          band: 1,
          gain: 0.25 + 0.025
        },
        {
          band: 2,
          gain: 0.25 + 0.0125
        },
        {
          band: 3,
          gain: 0.25 + 0
        },
        {
          band: 4,
          gain: 0.25 + 0
        },
        {
          band: 5,
          gain: 0.25 + -0.0125
        },
        {
          band: 6,
          gain: 0.25 + -0.025
        },
        {
          band: 7,
          gain: 0.25 + -0.0175
        },
        {
          band: 8,
          gain: 0.25 + 0
        },
        {
          band: 9,
          gain: 0.25 + 0
        },
        {
          band: 10,
          gain: 0.25 + 0.0125
        },
        {
          band: 11,
          gain: 0.25 + 0.025
        },
        {
          band: 12,
          gain: 0.25 + 0.375
        },
        {
          band: 13,
          gain: 0.25 + 0.125
        },
        {
          band: 14,
          gain: 0.25 + 0.125
        },
      ],
      gaming: [{
          band: 0,
          gain: 0.350
        },
        {
          band: 1,
          gain: 0.300
        },
        {
          band: 2,
          gain: 0.250
        },
        {
          band: 3,
          gain: 0.200
        },
        {
          band: 4,
          gain: 0.150
        },
        {
          band: 5,
          gain: 0.100
        },
        {
          band: 6,
          gain: 0.050
        },
        {
          band: 7,
          gain: -0.0
        },
        {
          band: 8,
          gain: -0.050
        },
        {
          band: 9,
          gain: -0.100
        },
        {
          band: 10,
          gain: -0.150
        },
        {
          band: 11,
          gain: -0.200
        },
        {
          band: 12,
          gain: -0.250
        },
        {
          band: 13,
          gain: -0.300
        },
        {
          band: 14,
          gain: -0.350
        },
      ],

      bassboost: client.bassboost.medium,
      earrape: client.bassboost.earrape
    };
}