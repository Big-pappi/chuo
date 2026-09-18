module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/features': './src/features',
            '@/api': './src/api',
            '@/utils': './src/utils',
            '@/theme': './src/theme',
            '@/hooks': './src/hooks',
            '@/types': './src/types',
            '@/constants': './src/constants',
            '@/navigation': './src/navigation',
            '@/store': './src/store',
          },
        },
      ],
    ],
  };
};
