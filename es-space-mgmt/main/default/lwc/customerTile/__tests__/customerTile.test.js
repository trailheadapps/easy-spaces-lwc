import { createElement } from 'lwc';
import CustomerTile from 'c/customerTile';
// imports the Salesforce Base URL from the mock implementation of lightning/navigation in jest-mocks
import { SalesforceBaseUrl } from 'lightning/navigation';

const CUSTOMER_DETAILS = {
    name: 'Test 1',
    email: 'test1@example.com',
    city: 'NY',
    state: 'NY',
    status: 'Open',
    Id: '0000000'
};

const SOBJECT_TYPE = 'Lead';

describe('c-customer-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    async function flushPromises() {
        return Promise.resolve();
    }

    it('displays the correct content in the tile', () => {
        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER_DETAILS;
        element.object = SOBJECT_TYPE;
        document.body.appendChild(element);

        const linkEl = element.shadowRoot.querySelector('a');
        expect(linkEl.textContent).toBe(CUSTOMER_DETAILS.name);

        const pElements = element.shadowRoot.querySelectorAll('p');
        expect(pElements[0].textContent).toBe(
            `Status: ${CUSTOMER_DETAILS.status}`
        );
        expect(pElements[1].textContent).toBe(
            `Email: ${CUSTOMER_DETAILS.email}`
        );
    });

    it('displays the correct icon in the tile', () => {
        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER_DETAILS;
        element.object = SOBJECT_TYPE;
        document.body.appendChild(element);

        const lowerCaseObjectName = SOBJECT_TYPE.toLowerCase();

        const iconElement = element.shadowRoot.querySelector('lightning-icon');
        expect(iconElement.iconName).toBe(`standard:${lowerCaseObjectName}`);
        expect(iconElement.alternativeText).toBe(
            `Navigate to ${SOBJECT_TYPE} record detail for ${CUSTOMER_DETAILS.name}`
        );
    });

    it('clicking the tile fires the customerselect custom event', async () => {
        const SELECT_EVENT_DETAIL = {
            customerId: '0000000',
            sobjectType: 'Lead',
            state: 'NY'
        };

        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER_DETAILS;
        element.object = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        element.addEventListener('customerselect', handler);

        const divEl = element.shadowRoot.querySelector('div');
        divEl.click();

        await flushPromises();

        // Validate if event got fired
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail).toEqual(SELECT_EVENT_DETAIL);
    });

    it('check if the hyperlink has correct href and alt attributes', async () => {
        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });
        element.customer = CUSTOMER_DETAILS;
        element.object = SOBJECT_TYPE;
        document.body.appendChild(element);

        await flushPromises();

        // Validate if event got fired
        const linkEl = element.shadowRoot.querySelector('a');
        expect(linkEl.getAttribute('alt')).toBe(
            `Navigate to ${SOBJECT_TYPE} record detail for ${CUSTOMER_DETAILS.name}`
        );
        expect(linkEl.href).toBe(SalesforceBaseUrl + CUSTOMER_DETAILS.Id);
    });

    it('is accessible', async () => {
        const element = createElement('c-customer-tile', {
            is: CustomerTile
        });

        element.customer = CUSTOMER_DETAILS;
        element.object = SOBJECT_TYPE;
        document.body.appendChild(element);

        await flushPromises();

        return expect(element).toBeAccessible();
    });
});
