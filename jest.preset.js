const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['text', 'json', 'cobertura'],
  collectCoverageFrom: ['./src/**'],
  passWithNoTests: true,
};
