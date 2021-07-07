import { createElement } from 'lwc';
import CustomerList from 'c/customerList';

import { subscribe, publish, MessageContext } from 'lightning/messageService';
import getCustomerList from '@salesforce/apex/reservationManagerController.getCustomerList';
import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';

import { refreshApex } from '@salesforce/apex';

// Realistic data with a list of customers
const mockCustomerList = require('./data/getCustomerList.json');

const SOBJECT_TYPE = 'Lead';

// mock apex method getCustomerList
jest.mock(
    '@salesforce/apex/reservationManagerController.getCustomerList',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

// mock apex refresh method
jest.mock(
    '@salesforce/apex',
    () => {
        return {
            refreshApex: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-customer-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('displays a list of customers based on sObjectType', () => {
        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Emit data from @wire
        getCustomerList.emit(mockCustomerList);

        return Promise.resolve().then(() => {
            const customerTileElements =
                element.shadowRoot.querySelectorAll('c-customer-tile');
            expect(customerTileElements.length).toBe(mockCustomerList.length);
            expect(customerTileElements[0].customer).toStrictEqual(
                mockCustomerList[0]
            );
            expect(customerTileElements[0].object).toBe(SOBJECT_TYPE);
        });
    });

    it('displays error panel when getCustomerList wire adapter returns an error', () => {
        const WIRE_ERROR = 'Something bad happened';

        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Emit error from @wire
        getCustomerList.error(WIRE_ERROR);

        return Promise.resolve().then(() => {
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.errors.body).toBe(WIRE_ERROR);
            expect(errorPanelEl.friendlyMessage).toBe(
                'There was an issue loading customers.'
            );
        });
    });

    it('clicking a customer tile fires the TILE_SELECTION_MC event', () => {
        const SELECT_EVENT_DETAIL = {
            customerId: '0000000',
            sobjectType: 'Lead',
            state: 'NY'
        };
        const LMS_PAYLOAD = {
            tileType: 'customer',
            properties: SELECT_EVENT_DETAIL
        };

        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Emit data from @wire
        getCustomerList.emit(mockCustomerList);

        return Promise.resolve().then(() => {
            const customerTileElement =
                element.shadowRoot.querySelector('c-customer-tile');
            customerTileElement.dispatchEvent(
                new CustomEvent('customerselect', {
                    detail: SELECT_EVENT_DETAIL
                })
            );

            // Was publish called and was it called with the correct params?
            expect(publish).toHaveBeenCalledWith(
                undefined,
                TILE_SELECTION_MC,
                LMS_PAYLOAD
            );
        });
    });

    it('subscribes to the FLOW_STATUS_CHANGE_MC on load', () => {
        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        expect(subscribe).toHaveBeenCalled();
        expect(subscribe.mock.calls[0][1]).toBe(FLOW_STATUS_CHANGE_MC);
    });

    it('Refreshes Customer List when a flow completed event is received through LMS', () => {
        // Create element
        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Simulate pulishing a message using FLOW_STATUS_CHANGE_MC message channel
        const messagePayload = {
            flowName: 'createReservation',
            status: 'FINISHED',
            state: { sobjecttype: SOBJECT_TYPE }
        };

        publish(
            // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
            MessageContext,
            FLOW_STATUS_CHANGE_MC,
            messagePayload
        );

        return Promise.resolve().then(() => {
            expect(refreshApex).toHaveBeenCalled();
        });
    });

    it('is accessible when customer list returned', () => {
        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Emit data from @wire
        getCustomerList.emit(mockCustomerList);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error returned', () => {
        const WIRE_ERROR = 'Something bad happened';

        const element = createElement('c-customer-list', {
            is: CustomerList
        });

        element.sobject = SOBJECT_TYPE;
        document.body.appendChild(element);

        // Emit error from @wire
        getCustomerList.error(WIRE_ERROR);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
