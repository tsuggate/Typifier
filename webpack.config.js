var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var webpack = require('webpack');


module.exports = {
   entry: {
      "main": './src/transpiler2/main.ts',
      "renderer": './src/ui/renderer.ts',
      "cmd": './src/transpiler2/cmd.ts',
      "test-spec": './src/test/test-main.ts'
   },
   output: {
      path: path.join(__dirname, 'dist/'),
      filename: '[name].js'
   },
   target: "electron",
   resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
   },
   module: {
      rules: [
         // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
         {test: /\.tsx?$/, loader: 'ts-loader', options: { silent: true }},
         {
            test: /\.css$/,
            exclude: /(node_modules)/,
            loader: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: [
                  {
                     loader: 'css-loader',
                     options: { sourceMap: true }
                  }
               ]
            })
         },
         {
            test: /\.less$/,
            exclude: /(node_modules)/,
            loader: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: [
                  {
                     loader: 'css-loader',
                     options: { sourceMap: true }
                  },
                  {
                     loader: 'less-loader',
                     options: { sourceMap: true }
                  }
               ]
            })
         },
         {
            test: /\.html$/,
            loader: "raw-loader"
         },
         {
            test: /\.svg(?:[\?#]|$)/,
            loader: "url-loader",
            options: { limit: 10000 }
         }, {
            test: /\.png(?:[\?#]|$)/,
            loader: "url-loader",
            options: { limit: 10000 }
         }, {
            test: /\.gif(?:[\?#]|$)/,
            loader: "url-loader",
            options: { limit: 10000 }
         }, {
            test: /\.jpg(?:[\?#]|$)/,
            loader: "url-loader",
            options: { limit: 10000 }
         }
      ],
      noParse: /node_modules\/json-schema\/lib\/validate\.js/
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
};

function getPlugins() {
   const plugins = [
      new webpack.DefinePlugin({
         "global.GENTLY": false,
         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new ExtractTextPlugin({ filename: '[name].css' }),
   ];

   // if (process.env.NODE_ENV === 'production') {
   //    plugins.push(new webpack.optimize.UglifyJsPlugin());
   // }

   return plugins;
}