const path = require('path');
const packageJson = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const setupFilename = packageJson.name + ' Setup ' + packageJson.version + '.exe';
console.log("##teamcity[setParameter name='setupFilename' value='" + setupFilename + "']");

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development';
  console.log({mode: argv.mode});

  return {
    mode: argv.mode,
    entry: {
      main: './src/main-process/main-window.ts',
      renderer: './src/renderer/renderer.ts',
    },
    output: {
      path: path.join(__dirname, 'distr/'),
      filename: '[name].js',
    },
    target: 'electron-renderer',
    node: false,
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {test: /\.tsx?$/, loader: 'ts-loader', options: {silent: true}},
        {
          test: /\.css$/,
          use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin({filename: '[name].css'})],
    devtool: devMode ? 'eval-cheap-module-source-map' : undefined,
  };
};
