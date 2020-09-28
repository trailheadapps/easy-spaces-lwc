import { createElement } from 'lwc';
import ReservationTile from 'c/reservationTile';

const RESERVATION_CONTACT = require('./data/contactReservation.json');

const RESERVATION_LEAD = require('./data/leadReservation.json');

describe('c-reservation-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders c-reservation-tile for Lead', () => {
        const element = createElement('c-reservation-tile', {
            is: ReservationTile
        });
        element.reservation = RESERVATION_LEAD;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // check for div class
            const divElement = element.shadowRoot.querySelector('div');
            expect(divElement).not.toBeNull();

            // check for paragraph text nodes
            const paragraphElements = element.shadowRoot.querySelectorAll('p');
            expect(paragraphElements[0].textContent).toBe(
                `Customer: ${RESERVATION_LEAD.record.Lead__r.Name}`
            );
            // check for status text nodes
            expect(paragraphElements[1].textContent).toBe(
                `Status: ${RESERVATION_LEAD.record.Status__c}`
            );
            expect(paragraphElements[2].textContent).toBe(
                `Market: ${RESERVATION_LEAD.record.Market__r.Name}`
            );
            expect(paragraphElements[5].textContent).toBe(
                `Total Guests: ${RESERVATION_LEAD.record.Total_Number_of_Guests__c}`
            );
            // check value of formatted date elements
            const datetimeElements = element.shadowRoot.querySelectorAll(
                'lightning-formatted-date-time'
            );
            expect(datetimeElements[0].value).toBe(
                RESERVATION_LEAD.record.Start_Date__c
            );
            expect(datetimeElements[1].value).toBe(
                RESERVATION_LEAD.record.End_Date__c
            );
        });
    });

    it('renders reservationTile for Contact', () => {
        const element = createElement('c-reservation-tile', {
            is: ReservationTile
        });
        element.reservation = RESERVATION_CONTACT;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // check for div class
            const divElement = element.shadowRoot.querySelector('div');
            expect(divElement).not.toBeNull();
            expect(divElement.className).toBe('pointer');

            // check for paragraph text nodes
            const paragraphElements = element.shadowRoot.querySelectorAll('p');
            expect(paragraphElements[0].textContent).toBe(
                `Customer: ${RESERVATION_CONTACT.record.Contact__r.Name}`
            );
            expect(paragraphElements[1].textContent).toBe(
                `Status: ${RESERVATION_CONTACT.record.Status__c}`
            );
            expect(paragraphElements[2].textContent).toBe(
                `Market: ${RESERVATION_CONTACT.record.Market__r.Name}`
            );
            expect(paragraphElements[5].textContent).toBe(
                `Total Guests: ${RESERVATION_CONTACT.record.Total_Number_of_Guests__c}`
            );
            // check value of formatted date elements
            const datetimeElements = element.shadowRoot.querySelectorAll(
                'lightning-formatted-date-time'
            );
            expect(datetimeElements[0].value).toBe(
                RESERVATION_CONTACT.record.Start_Date__c
            );
            expect(datetimeElements[1].value).toBe(
                RESERVATION_CONTACT.record.End_Date__c
            );
        });
    });

    it('fires a reservationselect for contact', () => {
        const element = createElement('c-reservation-tile', {
            is: ReservationTile
        });
        element.reservation = RESERVATION_CONTACT;
        document.body.appendChild(element);

        // listen to reservationselect event
        const handler = jest.fn();
        element.addEventListener('reservationselect', handler);
        // click on div element
        element.shadowRoot.querySelector('div').click();

        return Promise.resolve().then(() => {
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.reservationId).toBe(
                RESERVATION_CONTACT.record.Id
            );
            expect(handler.mock.calls[0][0].detail.marketId).toBe(
                RESERVATION_CONTACT.record.Market__c
            );
            expect(handler.mock.calls[0][0].detail.customerName).toBe(
                RESERVATION_CONTACT.record.Contact__r.Name
            );
        });
    });

    it('fires a reservationselect for lead', () => {
        const element = createElement('c-reservation-tile', {
            is: ReservationTile
        });
        element.reservation = RESERVATION_LEAD;
        document.body.appendChild(element);

        // listen to reservationselect event
        const handler = jest.fn();
        element.addEventListener('reservationselect', handler);
        // click on div element
        element.shadowRoot.querySelector('div').click();

        return Promise.resolve().then(() => {
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.reservationId).toBe(
                RESERVATION_LEAD.record.Id
            );
            expect(handler.mock.calls[0][0].detail.marketId).toBe(
                RESERVATION_LEAD.record.Market__c
            );
            expect(handler.mock.calls[0][0].detail.customerName).toBe(
                RESERVATION_LEAD.record.Lead__r.Name
            );
        });
    });

    it('validates cssClass on reservation mute', () => {
        const element = createElement('c-reservation-tile', {
            is: ReservationTile
        });
        element.reservation = RESERVATION_LEAD;
        document.body.appendChild(element);
        // check for div class
        const divElement = element.shadowRoot.querySelector('div');
        expect(divElement.className).toBe('mute pointer');
    });

    it('is accessible', () => {
        const element = createElement('c-reservation-tile', {
            is: ReservationTile
        });

        element.reservation = RESERVATION_LEAD;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
