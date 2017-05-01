module.exports = {
   entry: {
      "main": './src/transpiler2/main.ts',
      "cmd": './src/transpiler2/cmd.ts',
      "test-spec": './src/test/test-main.ts'
   },
   output: {
      path: './dist/',
      filename: '[name].js'
   },
   target: "electron",
   resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
   },
   module: {
      loaders: [
         // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
         {test: /\.tsx?$/, loader: 'ts-loader'},
         {test: /\.json$/, loader: "json-loader"}
      ],
      noParse: /node_modules\/json-schema\/lib\/validate\.js/
   },
   exclude: [
      "./node_modules"
   ],
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
