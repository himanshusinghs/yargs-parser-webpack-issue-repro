const path = require("path");
// const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  devtool: "source-map",
  entry: "./src/args-parser.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
        clean: true,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "args-parser.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
          },
        },
      },
    ],
  },
  // externals: [nodeExternals()],
};
