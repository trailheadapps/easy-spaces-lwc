import { createElement } from 'lwc';
import CustomerDetailForm from 'c/customerDetailForm';
import getCustomerFields from '@salesforce/apex/customerServices.getCustomerFields';

// Mock realistic data
const APEX_GET_CUSTOMER_FIELDS_SUCCESS = {
    city: 'MailingCity',
    email: 'Email',
    name: 'Name',
    state: 'MailingState'
};

const APEX_GET_CUSTOMER_FIELDS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

const FORM_SUBMIT_RESPONSE = require('./data/formSubmitSuccessFields.json');

// Mocking imperative Apex method call
jest.mock(
    '@salesforce/apex/customerServices.getCustomerFields',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-customer-detail-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('renders the detail form successfully', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';
        const RECORD_FIELDS_OUTPUT = [
            'MailingCity',
            'Email',
            'Name',
            'MailingState'
        ];

        // Create element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = OBJECT_API_NAME_INPUT;
        element.recordid = RECORD_ID_INPUT;
        document.body.appendChild(element);

        return flushPromises().then(() => {
            // Validate if correct parameters have been passed to base components
            const formEl = element.shadowRoot.querySelector(
                'lightning-record-form'
            );

            expect(formEl.fields).toEqual(RECORD_FIELDS_OUTPUT);
            expect(formEl.recordId).toBe(RECORD_ID_INPUT);
            expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
        });
    });

    it('handles form submission succesfully and fires a custom event', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const EVENT_DETAIL_PARAMETER = 'NY';

        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = OBJECT_API_NAME_INPUT;
        element.recordid = RECORD_ID_INPUT;
        document.body.appendChild(element);

        // Mock handler for child event
        const customerUpdateHandler = jest.fn();
        // Add event listener to catch child event
        element.addEventListener('customerupdate', customerUpdateHandler);

        return flushPromises()
            .then(() => {
                // Validate if correct parameters have been passed to base components
                const formEl = element.shadowRoot.querySelector(
                    'lightning-record-form'
                );
                formEl.dispatchEvent(
                    new CustomEvent('success', { detail: FORM_SUBMIT_RESPONSE })
                );
            })
            .then(() => {
                expect(customerUpdateHandler).toHaveBeenCalled();
                expect(customerUpdateHandler.mock.calls[0][0].detail).toEqual(
                    EVENT_DETAIL_PARAMETER
                );
            });
    });

    it('shows error panel element', () => {
        // Assign mock value for rejected Apex promise
        getCustomerFields.mockRejectedValue(APEX_GET_CUSTOMER_FIELDS_ERROR);

        // Create element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = 'Lead';
        element.recordId = '0000000000';
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.errors).toStrictEqual(
                APEX_GET_CUSTOMER_FIELDS_ERROR
            );
        });
    });
});
