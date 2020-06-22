import { createElement } from 'lwc';
import getCustomerFields from '@salesforce/apex/customerServices.getCustomerFields';
import CustomerDetailForm from 'c/customerDetailForm';

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

// Sample data for imperative Apex call
const CUSTOMER_FIELDS_MDT = {
    name: 'FullName',
    email: 'Email',
    city: 'City',
    state: 'State',
    status: 'Status',
    Id: '00Q5500000BFveDEAT'
};
const RECORD_ID_INPUT = '00Q5500000BFveDEAT';
const OBJECT_API_NAME_INPUT = 'Lead';

// Sample error for imperative Apex call
const CUSTOMER_FIELDS_MDT_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

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

    it('render lightning-record-form', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(CUSTOMER_FIELDS_MDT);
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        // Set public properties
        element.recordid = RECORD_ID_INPUT;
        element.sobjecttype = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state.

        return flushPromises().then(() => {
            // Validate if correct parameters have been passed to base components
            const formEl = element.shadowRoot.querySelector(
                'lightning-record-form'
            );
            expect(formEl).not.toBeNull();
            expect(formEl.fields).toEqual(Object.values(CUSTOMER_FIELDS_MDT));
            expect(formEl.recordId).toBe(RECORD_ID_INPUT);
            expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
        });
    });

    it('renders the error panel when the Apex method returns an error', () => {
        // Assing mock value for rejected Apex promise
        getCustomerFields.mockRejectedValue(CUSTOMER_FIELDS_MDT_ERROR);

        // Create initial element
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        element.sobjecttype = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);
        // Return an immediate flushed promise (after the Apex call) to then
        // wait for any asynchronous DOM updates. Jest will automatically wait
        // for the Promise chain to complete before ending the test and fail
        // the test if the promise ends in the rejected state.
        return flushPromises().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });

    it('success event handler on lightning-record-form', () => {
        const RECORD_DATA = {
            State: { value: 'CA' },
            Id: '00Q5500000BFveDEAT'
        };
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(CUSTOMER_FIELDS_MDT);
        const element = createElement('c-customer-detail-form', {
            is: CustomerDetailForm
        });
        // Set public properties
        element.recordid = RECORD_ID_INPUT;
        element.sobjecttype = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);
        // listen to customerupdate event
        const handler = jest.fn();
        element.addEventListener('customerupdate', handler);

        return flushPromises().then(() => {
            const formEl = element.shadowRoot.querySelector(
                'lightning-record-form'
            );
            formEl.dispatchEvent(
                new CustomEvent('success', {
                    detail: { fields: RECORD_DATA }
                })
            );
            Promise.resolve().then(() => {
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail).toBe(
                    RECORD_DATA.State.value
                );
            });
        });
    });
});
