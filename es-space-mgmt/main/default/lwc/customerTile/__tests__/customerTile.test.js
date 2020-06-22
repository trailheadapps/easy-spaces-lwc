import { createElement } from 'lwc';
import CustomerTile from 'c/customerTile';
import { getGenerateUrlCalledWith } from 'lightning/navigation';

const CUSTOMER = {
    name: 'Test Lead',
    Id: '00Q5500000BFveDEAT'
};
const OBJECT_NAME = 'Lead';

describe('c-customer-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('render customer tile', () => {
        const expectedAlternativeText =
            'Navigate to Lead record detail for ' + CUSTOMER.name;
        const expectedIconName = 'standard:' + OBJECT_NAME.toLowerCase();
        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER;
        element.object = OBJECT_NAME;
        document.body.appendChild(element);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const iconElement = element.shadowRoot.querySelector(
                'lightning-icon'
            );
            expect(iconElement).not.toBeNull();
            expect(iconElement).not.toBe(undefined);
            expect(iconElement.iconName).toEqual(expectedIconName);
            expect(iconElement.alternativeText).toEqual(
                expectedAlternativeText
            );
        });
    });

    it('generate url for navigation', () => {
        // Nav param values to test later
        const NAV_TYPE = 'standard__recordPage';
        const NAV_RECORDID = '00Q5500000BFveDEAT';
        const NAV_ACTION_NAME = 'view';

        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER;
        element.object = OBJECT_NAME;
        document.body.appendChild(element);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const { pageReference } = getGenerateUrlCalledWith();
            expect(pageReference.type).toBe(NAV_TYPE);
            expect(pageReference.attributes.recordId).toBe(NAV_RECORDID);
            expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
        });
    });

    it('click on customer tile', () => {
        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER;
        element.object = OBJECT_NAME;
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('customerselect', handler);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const divElement = element.shadowRoot.querySelector('div.pointer');
            divElement.click();
            Promise.resolve().then(() => {
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail.customerId).toBe(
                    CUSTOMER.Id
                );
                expect(handler.mock.calls[0][0].detail.sobjectType).toBe(
                    OBJECT_NAME
                );
            });
        });
    });
});
