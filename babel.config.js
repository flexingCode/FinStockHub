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
    'module:react-native-dotenv',
    'react-native-reanimated/plugin',
  ],
};
