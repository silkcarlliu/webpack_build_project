const path = require('path')
const ESlintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const os = require("os")
// cpu核数
const threads = os.cpus().length

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js",
    clean: true,
  },
  module: {
    rules: [
      //loader的配置
      {
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "thread-loader",
                options: {
                  workers: threads - 1,
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, //开启babel缓存
                  cacheCompression: false, //关闭缓存压缩
                },
              },
            ],
          },
          {
            test: /\.css$/, //只检测.css文件
            use: [//执行顺序由下到上
              "style-loader",
              "css-loader"
            ],
          },
          {
            test: /\.less$/,
            use: [
              "style-loader",
              "css-loader",
              "less-loader",
            ],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader",
            ]
          },
          {
            test: /\.styl$/,
            use: [
              "style-loader",
              "css-loader",
              "stylus-loader",
            ]
          },
          {
            //处理图片资源
            test: /\.(png|jpe?g|git|webp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
              },
            },
            generator: {
              // 将图片文件输出到 static/imgs 目录中
              // 将图片文件命名 [hash:10][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: "static/imgs/[hash:8][ext][query]",
            },
          },
          {
            test: /\.(ttf|woff2?|map4|map3|avi|flac)$/,
            type: "asset/resource",
            generator: {
              filename: "static/media/[hash:10][ext][query]",
            },
          },
        ]
      }
    ],
  },
  plugins: [
    //plugin的配置
    new ESlintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node-modules",
      cache: true,
      threads,
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html")
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: threads,
      }),
    ],
  },
  //开发服务器 不会生成dist文件夹下的文件
  devServer: {
    host: "localhost",
    port: "3000",
    open: true, //是否自动打开浏览器
    hot: true, //hmr (默认开启)热模块替换，js文件不支持，需要使用对应的vue-loader或者react-hot-loader
  },
  mode: "development",
  devtool: "cheap-module-source-map",
}
