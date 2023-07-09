module.exports = {
  resolve: {
      fallback: {
          "stream": require.resolve("stream-browserify"),
          // add this line if 'crypto' needs a fallback as well
          "crypto": require.resolve("crypto-browserify")
      }
  }
};
