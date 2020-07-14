/* eslint-disable @lwc/lwc/no-unexpected-wire-adapter-usages */
import { createElement } from 'lwc';
import getOpenReservations from '@salesforce/apex/reservationManagerController.getOpenReservations';
import {
    registerApexTestWireAdapter,
    registerTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import ReservationList from 'c/reservationList';
import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';
import { subscribe, MessageContext, publish } from 'lightning/messageService';

// Realistic data with a list of spaces
const mockOpenReservationsRecords = require('./data/getOpenReservations.json');
// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getOpenReservationsAdapter = registerApexTestWireAdapter(
    getOpenReservations
);
// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
const messageContextWireAdapter = registerTestWireAdapter(MessageContext);

describe('c-reservation-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('getOpenReservations @wire data', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(subscribe).toHaveBeenCalled();
        expect(subscribe.mock.calls[0][1]).toBe(FLOW_STATUS_CHANGE_MC);

        getOpenReservationsAdapter.emit(mockOpenReservationsRecords);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const reservationTileElement = element.shadowRoot.querySelectorAll(
                'c-reservation-tile'
            );
            expect(reservationTileElement.length).toBe(
                mockOpenReservationsRecords.length
            );
        });
    });

    it('subscribe to flow status change message', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Simulate pulishing a message using FLOW_STATUS_CHANGE_MC message channel
        const messagePayload = {
            flowName: 'spaceDesigner',
            status: 'FINISHED'
        };
        publish(
            messageContextWireAdapter,
            FLOW_STATUS_CHANGE_MC,
            messagePayload
        );

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const reservationTileElement = element.shadowRoot.querySelectorAll(
                'c-reservation-tile'
            );
            expect(reservationTileElement.length).toBe(0);
            expect(subscribe).toHaveBeenCalled();
            expect(subscribe.mock.calls[0][1]).toBe(FLOW_STATUS_CHANGE_MC);
        });
    });

    it('select a reservation tile from the list and test for Tile Selection LMS publish', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservationsAdapter.emit(mockOpenReservationsRecords);

        // payload to publish
        const PAYLOAD = {
            reservationId: mockOpenReservationsRecords[0].Id,
            marketId: mockOpenReservationsRecords[0].Market__c,
            customerName: mockOpenReservationsRecords[0].Contact__r.Name
        };

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // Select elements for validation
                const reservationTileElement = element.shadowRoot.querySelectorAll(
                    'c-reservation-tile'
                );
                expect(reservationTileElement.length).toBe(
                    mockOpenReservationsRecords.length
                );

                const reservationselectevt = new CustomEvent(
                    'reservationselect',
                    {
                        detail: PAYLOAD
                    }
                );
                reservationTileElement[0].dispatchEvent(reservationselectevt);
            })
            .then(() => {
                expect(publish).toHaveBeenCalled();
                const FINAL_PAYLOAD = {
                    tileType: 'reservation',
                    properties: PAYLOAD
                };
                // Was publish called and was it called with the correct params?
                expect(publish).toHaveBeenCalledWith(
                    undefined,
                    TILE_SELECTION_MC,
                    FINAL_PAYLOAD
                );
            });
    });
});
