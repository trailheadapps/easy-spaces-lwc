import { LightningElement, api, track, wire } from 'lwc';
import getMarketsByState from '@salesforce/apex/marketServices.getMarketsByState';
export default class ReservationDetailForm extends LightningElement {
    @api state;
    @api city;
    @api
    get people(){
        return this.numberOfPeople;
    }
    set people(value){
        this.numberOfPeople = value;
    }
    @api startdate;
    @api totaldays;

    @track cityOptions = [];
    @track chosenCity;
    @track dateRanges = [
        { label: '1 Day', value: '1' },
        { label: '7 Days', value: '7' },
        { label: '30 Days', value: '30' },
        { label: '60 Days', value: '60' },
        { label: 'More than 60 Days', value: '61' },
    ];
    @track numberOfPeople = 20;
    @track errorMsg;
    @track msgForUser;

    get placeholder() {
        return this.cityOptions.length > 0
            ? 'Choose a market'
            : 'No markets found';
    }

    @wire(getMarketsByState, { state: '$state' })
    wiredMarketData({ error, data }) {
        if (error) {
            this.errorMsg = error;
            this.msgForUser = 'There was an issue loading related market data.';
        } else if (data) {
            this.cityOptions = data.map(element => ({
                value: element.Id,
                label: element.City__c,
            }));
        }
    }

    handleCityChoice(event) {
        this.chosenCity = event.detail.value;
    }

    handleStartDate(event) {
        this.startdate = event.detail.value;
    }

    handleDateRange(event) {
        this.totaldays = event.detail.value;
    }

    handlePeopleSelect(event) {
        this.people = event.detail.value;
    }

    handleDraft() {
        const draftevt = new CustomEvent('draftreservation', {
            detail: {
                requestedMarket: this.chosenCity,
                numberOfPeople: this.people,
                startDate: this.startdate,
                endDays: this.totaldays,
            },
        });
        this.dispatchEvent(draftevt);
    }
}
