const path = require("path");
const prod = process.env.NODE_ENV === "production";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: prod ? "production" : "development",
  entry: "./src/index.tsx",
  devtool: prod ? undefined : "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            projectReferences: true,
            configFile: "tsconfig.build.json",
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    extensionAlias: {
      ".js": [".tsx", ".ts", ".js"],
    },
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
  ],
};
