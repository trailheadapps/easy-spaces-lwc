import { createElement } from 'lwc';
import getMarketsByState from '@salesforce/apex/marketServices.getMarketsByState';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import ReservationDetailForm from 'c/reservationDetailForm';

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getMarketsByStateAdapter = registerApexTestWireAdapter(getMarketsByState);

// Realistic data with a list of markets
const mockMarketsByStateRecords = require('./data/getMarketsByState.json');

// Realistic data with a list of markets returning 0 rows
const mockMarketsByStateNoRecords = require('./data/getMarketsByStateNoRecords.json');

// Constants for city, state and Start
const CITY = 'San Francisco';
const STATE = 'CA';
const START_DATE = '1/1/2020';
const NO_OF_PEOPLE = 50;
const NO_OF_DAYS = 15;

const CITY_OPTIONS = [
    { value: '0031700000pJRRSAA4', label: 'San Francisco' },
    { value: '0031700000pJRRSAA5', label: 'San Ramon' }
];

describe('c-reservation-detail-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // creates c-reservation-detail-form elements and appends to DOM.
    function createReservationDetailElement() {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        element.city = CITY;
        element.people = NO_OF_PEOPLE;
        element.startdate = START_DATE;
        element.totaldays = NO_OF_DAYS;
        document.body.appendChild(element);
        return element;
    }
    it('shows the error panel element when the Apex wire adapter getMarketsByState returns an error', () => {
        const ERROR_MESSAGE = 'An error occurred';
        const FRIENDLY_ERROR_MESSAGE =
            'There was an issue loading related market data.';

        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        document.body.appendChild(element);
        // Emit error from @wire
        getMarketsByStateAdapter.error(ERROR_MESSAGE);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.friendlyMessage).toBe(FRIENDLY_ERROR_MESSAGE);
            expect(errorPanelEl.errors.body).toBe(ERROR_MESSAGE);
        });
    });

    it('calls getMarketsByState wire with the right parameters', () => {
        const element = createReservationDetailElement();
        // Emit mock response from @wire
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const lighntingLayoutEl = element.shadowRoot.querySelector(
                'lightning-layout'
            );
            expect(lighntingLayoutEl).not.toBeNull();
            expect(getMarketsByStateAdapter.getLastConfig()).toStrictEqual({
                state: STATE
            });
        });
    });

    it('renders template with values passed via api after getMarketsByState wire call', () => {
        const DATE_RANGES = [
            { label: '1 Day', value: '1' },
            { label: '7 Days', value: '7' },
            { label: '30 Days', value: '30' },
            { label: '60 Days', value: '60' },
            { label: 'More than 60 Days', value: '61' }
        ];
        const CHOOSE_MARKET_PLACEHOLDER = 'Choose a market';

        const element = createReservationDetailElement();

        // Emit mock response from @wire
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const lighntingLayoutEl = element.shadowRoot.querySelector(
                'lightning-layout'
            );
            const lighntingComboBoxEl = element.shadowRoot.querySelector(
                'lightning-combobox'
            );
            const lighntingSliderEl = element.shadowRoot.querySelector(
                'lightning-slider'
            );
            const lighntingInputEl = element.shadowRoot.querySelector(
                'lightning-input'
            );
            const lighntingRadioGroupEl = element.shadowRoot.querySelector(
                'lightning-radio-group'
            );

            expect(lighntingLayoutEl).not.toBeNull();

            expect(lighntingComboBoxEl).not.toBeNull();
            expect(lighntingComboBoxEl.options).toStrictEqual(CITY_OPTIONS);
            expect(lighntingComboBoxEl.placeholder).toBe(
                CHOOSE_MARKET_PLACEHOLDER
            );

            expect(lighntingSliderEl).not.toBeNull();
            expect(lighntingSliderEl.value).toBe(NO_OF_PEOPLE);

            expect(lighntingInputEl).not.toBeNull();
            expect(lighntingInputEl.value).toBe(START_DATE);

            expect(lighntingRadioGroupEl).not.toBeNull();
            expect(lighntingRadioGroupEl.options).toMatchObject(DATE_RANGES);
        });
    });

    it('renders no city when getMarketsByState returns 0 rows', () => {
        const PLACEHOLDER_TEXT = 'No markets found';
        const element = createReservationDetailElement();

        // Emit mock response with 0 rows
        getMarketsByStateAdapter.emit(mockMarketsByStateNoRecords);
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const lighntingComboBoxEl = element.shadowRoot.querySelector(
                'lightning-combobox'
            );
            expect(lighntingComboBoxEl).not.toBeNull();
            expect(lighntingComboBoxEl.options).toStrictEqual([]);
            expect(lighntingComboBoxEl.placeholder).toBe(PLACEHOLDER_TEXT);
        });
    });

    it('handles change in city choice by combobox element', () => {
        const element = createReservationDetailElement();
        const UPDATE_CITY_CHOICE = 'San Ramon';

        // Emit mock response
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                const lighntingComboBoxEl = element.shadowRoot.querySelector(
                    'lightning-combobox'
                );
                // Change city
                const changeCity = new CustomEvent('change', {
                    detail: { value: UPDATE_CITY_CHOICE }
                });
                lighntingComboBoxEl.dispatchEvent(changeCity);
            })
            .then(() => {
                const lighntingComboBoxEl = element.shadowRoot.querySelector(
                    'lightning-combobox'
                );
                expect(lighntingComboBoxEl.value).toBe(UPDATE_CITY_CHOICE);
            });
    });

    it('handles change in number of people by slider element', () => {
        const element = createReservationDetailElement();
        const UPDATE_NUMBER_OF_PEOPLE = 100; // change from 50 to 100

        // Emit mock response
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const lighntingSliderEl = element.shadowRoot.querySelector(
                'lightning-slider'
            );
            // change Number of people
            const changeNoOfPeople = new CustomEvent('change', {
                detail: { value: UPDATE_NUMBER_OF_PEOPLE }
            });
            lighntingSliderEl.dispatchEvent(changeNoOfPeople);
            expect(element.people).toBe(UPDATE_NUMBER_OF_PEOPLE);
        });
    });

    it('handles change in start date by input element', () => {
        const element = createReservationDetailElement();
        const UPDATE_START_DATE = '2/14/2020';

        // Emit mock response
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const lighntingInputEl = element.shadowRoot.querySelector(
                'lightning-input'
            );
            //change Start Date
            const changeStartDate = new CustomEvent('change', {
                detail: { value: UPDATE_START_DATE }
            });
            lighntingInputEl.dispatchEvent(changeStartDate);
            expect(element.startdate).toBe(UPDATE_START_DATE);
        });
    });

    it('handles change in number of days by radio-group element', () => {
        const element = createReservationDetailElement();
        const UPDATE_NO_OF_DAYS = 7; // from 15 to 7

        // Emit mock response
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const lighntingRadioGroupEl = element.shadowRoot.querySelector(
                'lightning-radio-group'
            );
            //change Date Range
            const changeDateRange = new CustomEvent('change', {
                detail: { value: UPDATE_NO_OF_DAYS }
            });
            lighntingRadioGroupEl.dispatchEvent(changeDateRange);
            expect(element.totaldays).toBe(7);
        });
    });

    it('sends a draft reservation event via button click', () => {
        const element = createReservationDetailElement();
        // Emit mock response with 0 rows
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // listen to draftreservation event
        const handler = jest.fn();
        element.addEventListener('draftreservation', handler);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // verify combobox attributes are populated correctly
            element.shadowRoot.querySelector('lightning-button').click();
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.numberOfPeople).toBe(
                NO_OF_PEOPLE
            );
            expect(handler.mock.calls[0][0].detail.startDate).toBe(START_DATE);
            expect(handler.mock.calls[0][0].detail.endDays).toBe(NO_OF_DAYS);
        });
    });

    it('is accessible when markets returned', () => {
        const element = createReservationDetailElement();

        // Emit mock response from @wire
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no markets returned', () => {
        const element = createReservationDetailElement();

        document.body.appendChild(element);

        // Emit mock response with 0 rows
        getMarketsByStateAdapter.emit(mockMarketsByStateNoRecords);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when errors returned', () => {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getMarketsByStateAdapter.error();

        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
