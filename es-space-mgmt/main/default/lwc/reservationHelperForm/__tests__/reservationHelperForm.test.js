import { createElement } from 'lwc';
import { FlowNavigationNextEventName } from 'lightning/flowSupport';
import ReservationHelperForm from 'c/reservationHelperForm';
import getCustomerFields from '@salesforce/apex/customerServices.getCustomerFields';

// Mock realistic data
const APEX_GET_CUSTOMER_FIELDS_SUCCESS = {
    city: 'MailingCity',
    email: 'Email',
    name: 'Name',
    state: 'MailingState'
};

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

describe('c-reservation-helper-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('renders c-reservation-helper-form', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const CUSTOMERID = '00Q5500000BFveDEAT';
        const OBJECTTYPE = 'Lead';
        const STATE = 'CA';

        const element = createElement('c-reservation-helper-form', {
            is: ReservationHelperForm
        });
        element.customerid = CUSTOMERID;
        element.objecttype = OBJECTTYPE;
        element.state = STATE;
        document.body.appendChild(element);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const customerDetailForm = element.shadowRoot.querySelector(
                'c-customer-detail-form'
            );
            expect(customerDetailForm.recordid).toBe(CUSTOMERID);
            expect(customerDetailForm.sobjecttype).toBe(OBJECTTYPE);
        });
    });

    it('dispatches customer update event', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const CUSTOMERID = '00Q5500000BFveDEAT';
        const OBJECTTYPE = 'Lead';
        const STATE = 'CA';
        const STATE_NEW = 'NY';

        const element = createElement('c-reservation-helper-form', {
            is: ReservationHelperForm
        });
        element.customerid = CUSTOMERID;
        element.objecttype = OBJECTTYPE;
        element.state = STATE;
        document.body.appendChild(element);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const customerDetailForm = element.shadowRoot.querySelector(
                'c-customer-detail-form'
            );
            customerDetailForm.dispatchEvent(
                new CustomEvent('customerupdate', {
                    detail: STATE_NEW
                })
            );
            expect(element.state).toBe(STATE_NEW);
        });
    });

    it('dispatches draft reservation event', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const CUSTOMERID = '00Q5500000BFveDEAT';
        const OBJECTTYPE = 'Lead';
        const STATE = 'CA';

        const element = createElement('c-reservation-helper-form', {
            is: ReservationHelperForm
        });
        element.customerid = CUSTOMERID;
        element.objecttype = OBJECTTYPE;
        element.state = STATE;
        document.body.appendChild(element);

        // listen to flow navigate event
        const handler = jest.fn();
        element.addEventListener(FlowNavigationNextEventName, handler);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const customerDetailForm = element.shadowRoot.querySelector(
                'c-customer-detail-form'
            );
            customerDetailForm.dispatchEvent(
                new CustomEvent('draftreservation')
            );
            expect(handler).toHaveBeenCalled();
        });
    });

    it('is accessible', () => {
        // Assign mock value for resolved Apex promise
        getCustomerFields.mockResolvedValue(APEX_GET_CUSTOMER_FIELDS_SUCCESS);

        const CUSTOMERID = '00Q5500000BFveDEAT';
        const OBJECTTYPE = 'Lead';
        const STATE = 'CA';

        const element = createElement('c-reservation-helper-form', {
            is: ReservationHelperForm
        });
        element.customerid = CUSTOMERID;
        element.objecttype = OBJECTTYPE;
        element.state = STATE;

        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
