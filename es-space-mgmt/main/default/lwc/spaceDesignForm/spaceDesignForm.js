import { LightningElement, api, track, wire } from 'lwc';
import getRelatedSpaces from '@salesforce/apex/marketServices.getRelatedSpaces';

export default class SpaceDesignForm extends LightningElement {
    @api market;
    @api pillvalues = [];
    @track selectedtile;
    @track items = [];
    @track errorMsg;
    @track msgForUser;
    _records = [];
    _filters = [];

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
        this.items = this._records.map(record => {
            const types = record.Type__c.split(';');
            const muted = this._filters.some(filter => !types.includes(filter));
            return { record, muted };
        });
    }

    handleFilters(event) {
        this._filters = [...event.detail.filters];
        this.filterItems();
    }

    handleItemSelect(event) {
        this.selectedtile = event.detail.recordId;
    }

    handleSimpleAdd() {
        this.dispatchEvent(
            new CustomEvent('simpleupdate', {
                detail: { recordId: this.selectedtile },
            }),
        );
    }

    handleAddWithNav() {
        this.dispatchEvent(
            new CustomEvent('updatewithnav', {
                detail: { recordId: this.selectedtile },
            }),
        );
    }
}
