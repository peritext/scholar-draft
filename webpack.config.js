module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
        ]
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'raw-loader'
      // },
      {
        test: /\.scss$/,
        loader: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loader: ['style', 'css']
      }    ]
  }
};
