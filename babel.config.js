module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@stacks': './src/stacks',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
