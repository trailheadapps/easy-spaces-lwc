import { createElement } from 'lwc';
import ReservationHelper from 'c/reservationHelper';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

import { subscribe, MessageContext, publish } from 'lightning/messageService';

import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';

const MESSAGE_PAYLOAD = {
    tileType: 'customer',
    properties: {
        reservationId: 'a019A000005fpB7QAI',
        marketId: 'a009A000001mrfYQAQ',
        customerName: 'Test contact'
    }
};

describe('c-reservation-helper', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('subscribes to the TILE_SELECTION_MC on load', () => {
        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });

        document.body.appendChild(element);

        expect(subscribe).toHaveBeenCalled();
        expect(subscribe.mock.calls[0][1]).toBe(TILE_SELECTION_MC);
    });

    it('fires a FLOW_STATUS_CHANGE_MC message when handleFlowExit is called', () => {
        const SOBJECT_TYPE = 'Lead';
        const LMS_PAYLOAD = {
            flowName: 'createReservation',
            status: 'FINISHED',
            state: { sobjecttype: SOBJECT_TYPE }
        };

        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });
        document.body.appendChild(element);

        element.handleFlowExit({ detail: SOBJECT_TYPE });

        return Promise.resolve().then(() => {
            // Was publish called and was it called with the correct params?
            expect(publish).toHaveBeenCalledWith(
                undefined,
                FLOW_STATUS_CHANGE_MC,
                LMS_PAYLOAD
            );
        });
    });

    it('dispatches customerchoice event when a message on TILE_SELECTION_MC channel is received', () => {
        // Create element
        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        element.addEventListener('customerchoice', handler);

        // Simulate pulishing a message using TILE_SELECTION_MC message channel
        // We don't exercise this wire adapter in the tests.
        // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
        publish(MessageContext, TILE_SELECTION_MC, MESSAGE_PAYLOAD);

        return Promise.resolve().then(() => {
            // Validate if event got fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail).toEqual(
                MESSAGE_PAYLOAD.properties
            );
        });
    });

    it('fires a toast message when a flow interview is already in progress', () => {
        const TOAST_DETAIL = {
            title: 'Flow interview already in progress',
            message:
                'Finish the flow interview in progress before selecting another customer.',
            variant: 'error'
        };

        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        // Simulate pulishing a message using TILE_SELECTION_MC message channel
        // We don't exercise this wire adapter in the tests.
        // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
        publish(MessageContext, TILE_SELECTION_MC, MESSAGE_PAYLOAD);

        return Promise.resolve()
            .then(() => {
                // Validate that the toast message does not fire for the first TILE_SELECTION_MC event
                expect(handler).not.toHaveBeenCalled();
                publish(
                    // We don't exercise this wire adapter in the tests.
                    // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
                    MessageContext,
                    TILE_SELECTION_MC,
                    MESSAGE_PAYLOAD
                );
            })
            .then(() => {
                // Validate that the toast message does fire for the second TILE_SELECTION_MC event
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail).toStrictEqual(
                    TOAST_DETAIL
                );
            });
    });

    it('does not dispatch reservchoice event when a flow is in progress', () => {
        // Create element
        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        element.addEventListener('customerchoice', handler);

        // Simulate pulishing a message using TILE_SELECTION_MC message channel
        // We don't exercise this wire adapter in the tests.
        // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
        publish(MessageContext, TILE_SELECTION_MC, MESSAGE_PAYLOAD);

        return Promise.resolve()
            .then(() => {
                expect(handler).toHaveBeenCalledTimes(1);
                publish(
                    // We don't exercise this wire adapter in the tests.
                    // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
                    MessageContext,
                    TILE_SELECTION_MC,
                    MESSAGE_PAYLOAD
                );
            })
            .then(() => {
                expect(handler).toHaveBeenCalledTimes(1);
            });
    });

    it('does not fire a toast message when a flow interview is NOT in progress', () => {
        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(ShowToastEventName, handler);

        // Simulate pulishing a message using TILE_SELECTION_MC message channel
        // We don't exercise this wire adapter in the tests.
        // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
        publish(MessageContext, TILE_SELECTION_MC, MESSAGE_PAYLOAD);

        return Promise.resolve().then(() => {
            expect(handler).not.toHaveBeenCalled();
        });
    });

    it('does not fire events when message tileType is not customer', () => {
        const CUSTOMER_MESSAGE_PAYLOAD = {
            tileType: 'reservation',
            properties: {
                reservationId: 'a019A000005fpB7QAI',
                marketId: 'a009A000001mrfYQAQ',
                customerName: 'Test contact'
            }
        };

        const element = createElement('c-reservation-helper', {
            is: ReservationHelper
        });
        document.body.appendChild(element);

        // Mock handler for toast event
        const toastHandler = jest.fn();
        element.addEventListener(ShowToastEventName, toastHandler);

        // Mock handler for child event
        const customerChoiceHandler = jest.fn();
        element.addEventListener('customerchoice', customerChoiceHandler);

        // Simulate pulishing a message using TILE_SELECTION_MC message channel
        publish(
            // We don't exercise this wire adapter in the tests.
            // eslint-disable-next-line @lwc/lwc/no-unexpected-wire-adapter-usages
            MessageContext,
            TILE_SELECTION_MC,
            CUSTOMER_MESSAGE_PAYLOAD
        );

        return Promise.resolve().then(() => {
            expect(toastHandler).not.toHaveBeenCalled();
            expect(customerChoiceHandler).not.toHaveBeenCalled();
        });
    });
});
