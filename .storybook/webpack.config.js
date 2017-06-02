const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false'
        ],
        include: path.resolve(__dirname, '../'),
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'raw-loader'
      // },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
};
