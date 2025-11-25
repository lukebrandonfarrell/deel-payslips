module.exports = {
  // Use projects to have different configs for service tests vs component tests
  projects: [
    {
      displayName: 'services',
      testMatch: ['<rootDir>/src/services/**/*.test.{ts,tsx}'],
      testEnvironment: 'node',
      preset: 'ts-jest',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: {
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
          },
        }],
      },
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$': '<rootDir>/jest.fileMock.js',
      },
    },
    {
      displayName: 'components',
      preset: 'jest-expo',
      testMatch: [
        '<rootDir>/src/components/**/*.test.{ts,tsx}',
        '<rootDir>/src/pages/**/*.test.{ts,tsx}',
        '<rootDir>/src/hooks/**/*.test.{ts,tsx}',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|tamagui)',
      ],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
};

