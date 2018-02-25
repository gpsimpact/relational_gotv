var nodeExternals = require('webpack-node-externals');

module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config
    config.target = 'node';
    config.externals = [nodeExternals()];
    return config;
  },
};
