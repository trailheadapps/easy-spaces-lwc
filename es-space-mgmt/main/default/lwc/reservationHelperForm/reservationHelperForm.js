import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class reservationHelperForm extends LightningElement {
    //Flow input variables
    @api customerid;
    @api objecttype;
    currentstate;

    //Flow output variables
    @api startDate;
    @api endDays = 7;
    @api numberOfPeople = 150;
    @api requestedMarket;

    @api
    get state() {
        return this.currentstate;
    }
    set state(value) {
        this.currentstate = value;
    }
    customerFields = [];

    get detailsLoaded() {
        return this.customerFields.length > 0 ? true : false;
    }

    handleDetails(event) {
        this.customerFields = event.detail;
    }

    handleCustomerUpdate(event) {
        if (this.currentstate !== event.detail) {
            this.currentstate = event.detail;
        }
    }

    handleDraftReservation(event) {
        this.startDate = event.detail.startDate;
        this.endDays = event.detail.endDays;
        this.numberOfPeople = event.detail.numberOfPeople;
        this.requestedMarket = event.detail.requestedMarket;

        const nextNavigationEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNavigationEvent);
    }
}
