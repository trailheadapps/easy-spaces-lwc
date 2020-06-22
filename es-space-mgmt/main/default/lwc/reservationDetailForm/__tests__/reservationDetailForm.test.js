import { createElement } from 'lwc';
import getMarketsByState from '@salesforce/apex/marketServices.getMarketsByState';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import ReservationDetailForm from 'c/reservationDetailForm';

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getMarketsByStateAdapter = registerApexTestWireAdapter(getMarketsByState);

// Realistic data with a list of spaces
const mockMarketsRecordsByState = require('./data/getMarketsByState.json');

describe('c-reservation-detail-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('getMarketsByState @wire data and render components', () => {
        const STATE = 'CA';
        const DATE_RANGES = [
            { label: '1 Day', value: '1' },
            { label: '7 Days', value: '7' },
            { label: '30 Days', value: '30' },
            { label: '60 Days', value: '60' },
            { label: 'More than 60 Days', value: '61' }
        ];
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        document.body.appendChild(element);
        getMarketsByStateAdapter.emit(mockMarketsRecordsByState);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // verify combobox attributes are populated correctly
            const combobox = element.shadowRoot.querySelector(
                'lightning-combobox'
            );
            expect(combobox.options.length).toBe(
                mockMarketsRecordsByState.length
            );
            expect(combobox.placeholder).toBe('Choose a market');
            // verify slider attributes are populated correctly
            const slider = element.shadowRoot.querySelector('lightning-slider');
            expect(slider.value).toBe(20);
            // verify lightning input is rendered
            const input = element.shadowRoot.querySelector('lightning-input');
            expect(input).toBeDefined();
            expect(input).not.toBeNull();
            // verify for the lightning radio attributes are populated correctly
            const radioGroup = element.shadowRoot.querySelector(
                'lightning-radio-group'
            );
            expect(radioGroup.options).toMatchObject(DATE_RANGES);
        });
    });

    it('click button and initiate draft reservation', () => {
        const STATE = 'CA';
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        document.body.appendChild(element);
        getMarketsByStateAdapter.emit(mockMarketsRecordsByState);

        // listen to customerupdate event
        const handler = jest.fn();
        element.addEventListener('draftreservation', handler);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // verify combobox attributes are populated correctly
            const button = element.shadowRoot.querySelector('lightning-button');
            button.click();
            Promise.resolve().then(() => {
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail.numberOfPeople).toBe(20);
            });
        });
    });

    it('handle input value change events', () => {
        // Initial values
        const STATE = 'CA';
        const CITY = 'San Francisco';
        const STARTDATE = '01/01/2021';
        const TOTALDAYS = 100;

        // Values to change
        const CITY_NEW_VALUE = 'San Mateo';
        const NUMBER_OF_PEOPLE_NEW_VALUE = 40; // change from 20 to 40
        const STARTDATE_NEW_VALUE = '02/02/2002';
        const TOTALDAYS_NEW_VALUE = 200;

        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        element.city = CITY;
        element.startdate = STARTDATE;
        element.totaldays = TOTALDAYS;
        document.body.appendChild(element);

        getMarketsByStateAdapter.emit(mockMarketsRecordsByState);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // change combobox
            const combobox = element.shadowRoot.querySelector(
                'lightning-combobox'
            );
            combobox.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: CITY_NEW_VALUE }
                })
            );
            //change  slider values
            const slider = element.shadowRoot.querySelector('lightning-slider');
            slider.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: NUMBER_OF_PEOPLE_NEW_VALUE }
                })
            );
            //change lightning input
            const input = element.shadowRoot.querySelector('lightning-input');
            input.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: STARTDATE_NEW_VALUE }
                })
            );
            //change lightning input
            const radioGroup = element.shadowRoot.querySelector(
                'lightning-radio-group'
            );
            radioGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: TOTALDAYS_NEW_VALUE }
                })
            );

            Promise.resolve().then(() => {
                expect(combobox.value).toBe(CITY_NEW_VALUE);
                expect(slider.value).toBe(NUMBER_OF_PEOPLE_NEW_VALUE);
                expect(input.value).toBe(STARTDATE_NEW_VALUE);
                expect(radioGroup.value).toBe(TOTALDAYS_NEW_VALUE);
            });
        });
    });
});
