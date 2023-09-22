const path = require('path')
const ESlintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,//提取css成单独的文件
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env",//解决大部分样式兼容性问题
          ],
        }
      },
    },
    preProcessor,
  ].filter(Boolean);
}

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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/, //只检测.css文件
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
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
    ],
  },
  plugins: [
    //plugin的配置
    new ESlintWebpackPlugin({
      context: path.resolve(__dirname, "../src")
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html")
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css',
    }),
    new CssMinimizerPlugin(),
  ],
  mode: "production",
}