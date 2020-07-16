const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    // add any custom configurations here
    moduleNameMapper: {
        '^lightning/flowSupport$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/flowSupport',
        '^lightning/navigation$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/navigation',
        '^lightning/messageService$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/messageService'
    }
};
