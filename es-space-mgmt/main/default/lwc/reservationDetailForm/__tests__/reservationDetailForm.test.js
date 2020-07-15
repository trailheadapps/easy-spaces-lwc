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

    it('shows the error panel element when the Apex wire adapter getMarketsByState is invoked', () => {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        document.body.appendChild(element);
        // Emit error from @wire
        getMarketsByStateAdapter.error();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.friendlyMessage).toBe(
                'There was an issue loading related market data.'
            );
        });
    });

    it('getMarketsByState @wire data', () => {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        element.city = CITY;
        element.people = 50;
        element.startdate = START_DATE;
        element.totaldays = 15;
        document.body.appendChild(element);
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
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        const DATE_RANGES = [
            { label: '1 Day', value: '1' },
            { label: '7 Days', value: '7' },
            { label: '30 Days', value: '30' },
            { label: '60 Days', value: '60' },
            { label: 'More than 60 Days', value: '61' }
        ];
        element.state = STATE;
        element.city = CITY;
        element.people = 50;
        element.startdate = START_DATE;
        element.totaldays = 15;
        document.body.appendChild(element);
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
            expect(lighntingComboBoxEl.placeholder).toBe('Choose a market');
            expect(lighntingSliderEl).not.toBeNull();
            expect(lighntingInputEl).not.toBeNull();
            expect(lighntingRadioGroupEl).not.toBeNull();
            expect(lighntingRadioGroupEl.options).toMatchObject(DATE_RANGES);
        });
    });

    it('getMarketsByState @wire return no data', () => {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        element.city = CITY;
        element.people = 50;
        element.startdate = START_DATE;
        element.totaldays = 15;
        document.body.appendChild(element);
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
            expect(lighntingComboBoxEl.placeholder).toBe('No markets found');
        });
    });

    it('change input handlers', () => {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        element.city = CITY;
        element.people = 50;
        element.startdate = START_DATE;
        element.totaldays = 15;
        document.body.appendChild(element);
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
                    detail: { value: 'San Ramon' }
                });
                lighntingComboBoxEl.dispatchEvent(changeCity);

                const lighntingSliderEl = element.shadowRoot.querySelector(
                    'lightning-slider'
                );
                // change Number of people
                const changeNoOfPeople = new CustomEvent('change', {
                    detail: { value: 100 }
                });
                lighntingSliderEl.dispatchEvent(changeNoOfPeople);

                const lighntingInputEl = element.shadowRoot.querySelector(
                    'lightning-input'
                );
                //change Start Date
                const changeStartDate = new CustomEvent('change', {
                    detail: { value: '2/14/2020' }
                });
                lighntingInputEl.dispatchEvent(changeStartDate);

                const lighntingRadioGroupEl = element.shadowRoot.querySelector(
                    'lightning-radio-group'
                );
                //change Date Range
                const changeDateRange = new CustomEvent('change', {
                    detail: { value: 7 }
                });
                lighntingRadioGroupEl.dispatchEvent(changeDateRange);
            })
            .then(() => {
                expect(element.people).toBe(100);
                const lighntingComboBoxEl = element.shadowRoot.querySelector(
                    'lightning-combobox'
                );
                expect(lighntingComboBoxEl.value).toBe('San Ramon');
                expect(element.startdate).toBe('2/14/2020');
                expect(element.totaldays).toBe(7);
            });
    });

    it('send a draft reservation CustomEvent via button click', () => {
        const element = createElement('c-reservation-detail-form', {
            is: ReservationDetailForm
        });
        element.state = STATE;
        element.city = CITY;
        element.people = 50;
        element.startdate = START_DATE;
        element.totaldays = 15;
        document.body.appendChild(element);
        // Emit mock response with 0 rows
        getMarketsByStateAdapter.emit(mockMarketsByStateRecords);

        // listen to draftreservation event
        const handler = jest.fn();
        element.addEventListener('draftreservation', handler);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // verify combobox attributes are populated correctly
                const button = element.shadowRoot.querySelector(
                    'lightning-button'
                );
                button.click();
            })
            .then(() => {
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail.numberOfPeople).toBe(50);
                expect(handler.mock.calls[0][0].detail.startDate).toBe(
                    START_DATE
                );
                expect(handler.mock.calls[0][0].detail.endDays).toBe(15);
            });
    });
});
