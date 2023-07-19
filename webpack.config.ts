import { Configuration } from 'webpack';

const config: Configuration = {
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify")
    },
  },
};

module.exports = config;
