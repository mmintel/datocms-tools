module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/lib/$1',
  },
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/lib/**/*.js',
  ],
};
