const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    // add any custom configurations here
    moduleNameMapper: {
        '^lightning/flowSupport$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/flowSupport'
    }
};
