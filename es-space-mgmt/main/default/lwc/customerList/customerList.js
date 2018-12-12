import { LightningElement, api, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getCustomerList from '@salesforce/apex/reservationManagerController.getCustomerList';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class CustomerList extends LightningElement {
    @api sobject;
    @track customers;
    @track errorMsg;
    @track showDetails;
    @track msgForUser;
    wiredRecords;

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('flowfinish', this.handleFlowFinish, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    @wire(getCustomerList, { sObjectType: '$sobject' })
    wiredCustomerData(value) {
        this.wiredRecords = value;
        if (value.error) {
            this.errorMsg = value.error;
            this.msgForUser = 'There was an issue loading customers.';
            this.showDetails = false;
        } else if (value.data) {
            this.customers = value.data;
        }
    }

    handleFlowFinish(event) {
        if (event.detail === this.sobject) {
            return refreshApex(this.wiredRecords);
        }

        return undefined;
    }

    publishSelect(event) {
        fireEvent(this.pageRef, 'selectcustomer', { detail: event.detail });
    }
}
