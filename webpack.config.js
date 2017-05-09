module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
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
      }
    ]
  }
};
