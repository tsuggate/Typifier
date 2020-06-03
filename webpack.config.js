const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const setupFilename = packageJson.name + ' Setup ' + packageJson.version + '.exe';
console.log('##teamcity[setParameter name=\'setupFilename\' value=\'' + setupFilename + '\']');


module.exports = (env, argv) => {
   const devMode = argv.mode === 'development';
   console.log({mode: argv.mode});

   return ({
      mode: argv.mode,
      entry: {
         "main": './src/main-process/main-window.ts',
         "renderer": './src/renderer/renderer.ts'
      },
      output: {
         path: path.join(__dirname, 'distr/'),
         filename: '[name].js'
      },
      target: "electron-renderer",
      resolve: {
         extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
      },
      module: {
         rules: [
            {test: /\.tsx?$/, loader: 'ts-loader', options: {silent: true}},
            {
               test: /\.css$/,
               use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
            },
         ],
      },
      plugins: getPlugins(),
      node: {
         console: false,
         global: false,
         process: false,
         Buffer: false,
         __filename: false,
         __dirname: false
      },
      devtool: 'source-map'
   });
};

function getPlugins() {
   const plugins = [
      // new webpack.DefinePlugin({
      //    "global.GENTLY": false,
      //    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      // }),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
   ];

   // if (process.env.NODE_ENV === 'production') {
   //    plugins.push(new webpack.optimize.UglifyJsPlugin());
   // }

   return plugins;
}
