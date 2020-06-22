import { LightningElement, api, wire } from 'lwc';
import getRelatedSpaces from '@salesforce/apex/marketServices.getRelatedSpaces';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class SpaceDesignForm extends LightningElement {
    pillvalues = [
        'Scheduled Activity',
        'Come-and-Go',
        'Large Groups',
        'Individuals or Small Groups',
        'Indoor',
        'Outdoor',
        'Conversation Starter',
        'Energizing',
        'Quiet',
        'Relaxing'
    ];

    items = [];
    errorMsg;
    msgForUser;
    _records = [];
    _filters = [];
    _selectedtile;

    //Flow Input Variables
    @api market;

    //Flow Output Variables
    _popTabOnFinish = false;
    @api
    get selectedtile() {
        return this._selectedtile;
    }

    @api
    get popTabOnFinish() {
        return this._popTabOnFinish;
    }

    @wire(getRelatedSpaces, { recordId: '$market' })
    wiredSpaces({ error, data }) {
        if (error) {
            this.errorMsg = error;
            this.msgForUser = 'There was an issue loading related market data.';
            this._records = [];
        } else if (data) {
            this.errorMsg = undefined;
            this.msgForUser = undefined;
            this._records = data;
            this.filterItems();
        }
    }

    filterItems() {
        this.items = this._records.map((record) => {
            const types = record.Type__c.split(';');
            const muted = this._filters.some(
                (filter) => !types.includes(filter)
            );
            return { record, muted };
        });
    }

    handleFilters(event) {
        this._filters = [...event.detail.filters];
        this.filterItems();
    }

    handleItemSelect(event) {
        this._selectedtile = event.detail.recordId;
    }

    handleSimpleAdd() {
        const nextNavigationEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNavigationEvent);
    }

    handleAddWithNav() {
        this._popTabOnFinish = true;
        const nextNavigationEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNavigationEvent);
    }
}
