/* eslint-disable @lwc/lwc/no-unexpected-wire-adapter-usages */
import { createElement } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpenReservations from '@salesforce/apex/reservationManagerController.getOpenReservations';
import ReservationList from 'c/reservationList';
import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';
import { subscribe, MessageContext, publish } from 'lightning/messageService';

// mock apex method getOpenReservations
jest.mock(
    '@salesforce/apex/reservationManagerController.getOpenReservations',
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

// Realistic data with a list of spaces
const mockOpenReservationsRecords = require('./data/getOpenReservations.json');

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

describe('c-reservation-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('displays reservation tiles when there are records from @wire getOpenReservations', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservations.emit(mockOpenReservationsRecords);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // check if the text is rendered fine
            const openReservationParagraphElement =
                element.shadowRoot.querySelector('p.slds-text-heading_small');
            expect(openReservationParagraphElement.textContent).toBe(
                'Open Reservations:'
            );
            // check if tile elements are rendered properly
            const reservationTileElements =
                element.shadowRoot.querySelectorAll('c-reservation-tile');
            expect(reservationTileElements.length).toBe(
                mockOpenReservationsRecords.length
            );
            reservationTileElements.forEach((index, tile) => {
                expect(tile.reservation).toStrictEqual(
                    mockOpenReservationsRecords[index]
                );
            });
        });
    });

    it('subscribes to flow_status_change_mc message channel', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(subscribe).toHaveBeenCalled();
        expect(subscribe.mock.calls[0][1]).toBe(FLOW_STATUS_CHANGE_MC);
    });

    it('gets @wire reservations data', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservations.emit(mockOpenReservationsRecords);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const reservationTileElements =
                element.shadowRoot.querySelectorAll('c-reservation-tile');
            expect(reservationTileElements.length).toBe(
                mockOpenReservationsRecords.length
            );
        });
    });

    it('refreshes reservations when LMS message is received', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Simulate pulishing a message using FLOW_STATUS_CHANGE_MC message channel
        const messagePayload = {
            flowName: 'spaceDesigner',
            status: 'FINISHED'
        };
        publish(MessageContext, FLOW_STATUS_CHANGE_MC, messagePayload);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            expect(subscribe).toHaveBeenCalled();
            expect(subscribe.mock.calls[0][1]).toBe(FLOW_STATUS_CHANGE_MC);
            expect(refreshApex).toHaveBeenCalled();
        });
    });

    it('dispatches reservationselect event', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservations.emit(mockOpenReservationsRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select tile element to select and dispatch event
            const reservationTileElements =
                element.shadowRoot.querySelectorAll('c-reservation-tile');
            // payload to publish
            const PAYLOAD = {
                reservationId: mockOpenReservationsRecords[0].Id,
                marketId: mockOpenReservationsRecords[0].Market__c,
                customerName: mockOpenReservationsRecords[0].Contact__r.Name
            };
            // dispatch reservationselect event
            const reservationselectevt = new CustomEvent('reservationselect', {
                detail: PAYLOAD
            });
            reservationTileElements[0].dispatchEvent(reservationselectevt);

            expect(publish).toHaveBeenCalled();
            const FINAL_PAYLOAD = {
                tileType: 'reservation',
                properties: PAYLOAD
            };
            // assert that the publish was called with the correct params
            expect(publish).toHaveBeenCalledWith(
                undefined,
                TILE_SELECTION_MC,
                FINAL_PAYLOAD
            );
        });
    });

    it('mutes reservation tiles not selected', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservations.emit(mockOpenReservationsRecords);

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
                const reservationTileElements =
                    element.shadowRoot.querySelectorAll('c-reservation-tile');
                const reservationselectevt = new CustomEvent(
                    'reservationselect',
                    {
                        detail: PAYLOAD
                    }
                );
                // select first tile
                reservationTileElements[0].dispatchEvent(reservationselectevt);
            })
            .then(() => {
                const reservationTileElements =
                    element.shadowRoot.querySelectorAll('c-reservation-tile');
                const mutedElements = [];
                // collect all muted elements
                reservationTileElements.forEach((reservationTile) => {
                    if (
                        reservationTile.reservation.record.Id !==
                        reservationTileElements[0].reservation.record.Id
                    ) {
                        mutedElements.push(reservationTile);
                    }
                });
                // assert not selected elements are muted
                mutedElements.forEach((reservationTile) =>
                    expect(reservationTile.reservation.muted).toBe(true)
                );
            });
    });

    it('shows error panel element', () => {
        const WIRE_ERROR = 'Custom Exception';

        // Create initial element
        const element = createElement('c-reservation-tile', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getOpenReservations.error(WIRE_ERROR);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.errors.body).toBe(WIRE_ERROR);
            expect(errorPanelEl.friendlyMessage).toBe(
                'There was an issue loading reservations.'
            );
        });
    });

    it('renders reservation list with no tile element when @wire getOpenReservations returns 0 rows', () => {
        // Create initial element
        const element = createElement('c-reservation-tile', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Emit empty response from @wire
        getOpenReservations.emit([]);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // check if the text is rendered fine
            const noReservationParagraphElement =
                element.shadowRoot.querySelector('p.slds-var-m-left_small');
            expect(noReservationParagraphElement.textContent).toBe(
                'No open reservations found.'
            );
        });
    });

    it('is accessible when reservations returned', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservations.emit(mockOpenReservationsRecords);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no reservations returned', () => {
        const element = createElement('c-reservation-list', {
            is: ReservationList
        });
        document.body.appendChild(element);

        getOpenReservations.emit([]);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error returned', () => {
        const WIRE_ERROR = 'Custom Exception';

        // Create initial element
        const element = createElement('c-reservation-tile', {
            is: ReservationList
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getOpenReservations.error(WIRE_ERROR);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
