const { getDefaultConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

const config = getDefaultConfig(__dirname);

// Agregar alias después de obtener la configuración por defecto
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@stacks': path.resolve(__dirname, 'src/stacks'),
};

module.exports = withNativeWind(config, { input: "./global.css" });