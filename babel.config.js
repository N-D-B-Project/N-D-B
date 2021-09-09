/* eslint-disable linebreak-style */
module.exports = {
  presets: [['@babel/preset-env',
    {
      targets: {
        node: 'current',
      },
    },
  ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@/*': './Src/*',
        '@Client': './Src/Client/*',
        '@Structures/*': './Src/Utils/Structures/*',
        '@Handlers/*': './Src/Utils/Handlers/*',
        '@Schema/*': './Src/Database/Schema/*',
        '@Utils/*': './Src/Utils/*',
        '@Tools/*': './Src/Utils/Tools/*',
        '@Commands/*': './Src/Commands/*',
        '@Languages/*': './Src/Utils/Languages/*',
        '@Config/*': './Src/Config/*',
        '@Types/*': './Src/Types/*',
        "@Packages/*": "./Src/Packages/*"
      },
    }],
  ],
  ignore: [
    '**/*.spec.ts',
  ],
};
