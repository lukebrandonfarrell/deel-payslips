module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'off', // Disable if rule not found
    // Allow require() for asset files (fonts, images, PDFs) - standard in React Native/Expo
    '@typescript-eslint/no-require-imports': ['error', {
      allow: [
        '\\.ttf$',
        '\\.otf$',
        '\\.woff$',
        '\\.woff2$',
        '\\.png$',
        '\\.jpg$',
        '\\.jpeg$',
        '\\.gif$',
        '\\.svg$',
        '\\.pdf$',
        '/assets/',
      ],
    }],
    
    // React/React Native specific
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    
    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Allow unused vars that start with underscore
    'no-unused-vars': 'off', // Using TypeScript version instead
  },
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'build/',
    '*.config.js',
  ],
};

