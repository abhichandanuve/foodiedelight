module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.{js,jsx}", 
      "!src/**/*.test.{js,jsx}", 
    ],
    coverageReporters: ["json", "html", "text"],
  };
  