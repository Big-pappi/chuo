const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Exclude problematic asset patterns
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'json',
  'txt',
  'md',
];

module.exports = config;
