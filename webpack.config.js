const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: './src/main.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath,
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'element-ui': 'ELEMENT',
    mockjs: 'Mock',
    echarts: 'echarts',
    ueditor: 'UE',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.js$/,
        //use: ['babel-loader'],
        loader: 'babel-loader',
        //exclude: /node_modules/,
        include: [
          //resolve('node_modules/_vue-puzzle-vcode@1.1.4@vue-puzzle-vcode/dist/'),
          resolve('src')
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
  
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.vue', '.json', '.css'],
  },
  devServer: {
    useLocalIp: true,
    host: '192.168.1.166',
    port: 8010,
    // proxy: {
    //   '/api': {
    //     target: 'https://www.baidu.com/',
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    proxy: {
      '/api': {
        target: 'http://125.216.249.215:45678/',
        //target: 'http://127.0.0.1:12141/',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname,
    },
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map',
})
