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
    async function flushPromises() {
        return Promise.resolve();
    }

    it('renders the detail form successfully', async () => {
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

        await flushPromises();

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-form'
        );

        expect(formEl.fields).toEqual(RECORD_FIELDS_OUTPUT);
        expect(formEl.recordId).toBe(RECORD_ID_INPUT);
        expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
    });

    it('handles form submission succesfully and fires a custom event', async () => {
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

        await flushPromises();

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-form'
        );
        formEl.dispatchEvent(
            new CustomEvent('success', { detail: FORM_SUBMIT_RESPONSE })
        );

        await flushPromises();

        expect(customerUpdateHandler).toHaveBeenCalled();
        expect(customerUpdateHandler.mock.calls[0][0].detail).toEqual(
            EVENT_DETAIL_PARAMETER
        );
    });

    it('sends a draft reservation event via button click', async () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = 'Lead';
        element.recordId = '0000000000';
        document.body.appendChild(element);
        // listen to draftreservation event
        const handler = jest.fn();
        element.addEventListener('draftreservation', handler);

        await flushPromises();

        element.shadowRoot.querySelector('lightning-button').click();
        expect(handler).toHaveBeenCalled();
    });

    it('shows error panel element', async () => {
        // Assign mock value for rejected Apex promise
        getCustomerFields.mockRejectedValue(APEX_GET_CUSTOMER_FIELDS_ERROR);

        // Create element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = 'Lead';
        element.recordId = '0000000000';
        document.body.appendChild(element);

        await flushPromises();

        const errorPanelEl = element.shadowRoot.querySelector('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
        expect(errorPanelEl.errors).toStrictEqual(
            APEX_GET_CUSTOMER_FIELDS_ERROR
        );
    });

    it('is accessible when customer detail fields returned', async () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = OBJECT_API_NAME_INPUT;
        element.recordid = RECORD_ID_INPUT;
        document.body.appendChild(element);

        await flushPromises();

        return expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        // Assign mock value for rejected Apex promise
        getCustomerFields.mockRejectedValue(APEX_GET_CUSTOMER_FIELDS_ERROR);

        // Create element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = 'Lead';
        element.recordId = '0000000000';
        document.body.appendChild(element);

        await flushPromises();

        return expect(element).toBeAccessible();
    });
});
