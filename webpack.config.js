module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
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
        use: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        use: ['style', 'css']
      }    ]
  }
};
