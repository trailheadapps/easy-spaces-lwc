import { LightningElement, api, wire } from 'lwc';
import getRelatedSpaces from '@salesforce/apex/marketServices.getRelatedSpaces';
import { NavigationMixin } from 'lightning/navigation';

export default class RelatedSpaces extends NavigationMixin(LightningElement) {
    @api recordId;
    records;
    errorMsg;
    msgForUser;
    noRecords = false;

    @wire(getRelatedSpaces, { recordId: '$recordId' })
    wiredSpaces({ error, data }) {
        if (error) {
            this.errorMsg = error;
            this.msgForUser = 'There was an issue loading related market data.';
        } else if (data) {
            if (data.length) {
                this.records = data.map((record) => {
                    return { record, muted: false };
                });
                this.noRecords = false;
            } else {
                this.noRecords = true;
            }
        }
    }

    handleItemSelect(event) {
        event.stopPropagation();
        if (event.detail.recordId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: event.detail.recordId,
                    objectApiName: 'Space__c',
                    actionName: 'view'
                }
            });
        }
    }
}
