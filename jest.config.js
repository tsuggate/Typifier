module.exports = {
  roots: ['<rootDir>/src/'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageDirectory: '<rootDir>/coverage~~',
  collectCoverageFrom: ['app/**/*.{ts,tsx,js}'],
  testResultsProcessor: 'jest-teamcity',
};
