module.exports = [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.js'],
    rules: {
      curly: ['error', 'all'],
    },
  },
];
