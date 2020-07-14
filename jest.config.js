const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    // add any custom configurations here
    // add any custom configurations here
    moduleNameMapper: {
        '^lightning/messageService$':
            '<rootDir>/es-space-mgmt/test/jest-mocks/lightning/messageService'
    }
};
