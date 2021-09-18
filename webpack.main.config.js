const { execSync } = require("child_process");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.done.tap("AfterEmitPlugin", (compilation) => {
          execSync("chmod +x .webpack/main/native_modules/bin/ngrok");
          execSync("chmod +x .webpack/main/native_modules/ngrok");
        });
      },
    },
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
