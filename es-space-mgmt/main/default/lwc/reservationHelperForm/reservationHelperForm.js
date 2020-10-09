import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class reservationHelperForm extends LightningElement {
    //Flow input variables
    @api customerid;
    @api objecttype;
    currentstate;
    @api
    get state() {
        return this.currentstate;
    }
    set state(value) {
        this.currentstate = value;
    }

    //Flow output variables
    _endDays = 7;
    _numberOfPeople = 20;

    @api
    get startDate() {
        return this._startDate;
    }

    @api
    get endDays() {
        return this._endDays;
    }

    @api
    get numberOfPeople() {
        return this._numberOfPeople;
    }

    @api
    get requestedMarket() {
        return this._requestedMarket;
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

    handleDraftReservation() {
        const nextNavigationEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNavigationEvent);
    }
}
