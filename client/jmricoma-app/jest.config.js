module.exports = {
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios).+\\.js$"
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js',
    },
    testEnvironment: 'jsdom',
  };
  