const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    // add any custom configurations here
    moduleNameMapper: {
        '^lightning/flowSupport$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/flowSupport',
        '^lightning/navigation$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/navigation',
        '^lightning/flowSupport$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/flowSupport',
        '^lightning/messageService$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/messageService',
        '^lightning/flowSupport$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/flowSupport',
        '^lightning/platformShowToastEvent$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/platformShowToastEvent'
    }
};
