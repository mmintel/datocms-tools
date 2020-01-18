module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/lib/$1',
  },
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/lib/**/*.js',
  ],
  roots: [
    '<rootDir>/test/integration',
    '<rootDir>/test/unit',
  ],
};
