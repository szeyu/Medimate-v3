const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Add SQLite to the list of assetExts
config.resolver.assetExts.push('db');
config.resolver.assetExts.push('sqlite');
config.resolver.assetExts.push('sqlite3');

module.exports = config;
