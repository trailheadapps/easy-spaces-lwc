import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getCustomerList from '@salesforce/apex/reservationManagerController.getCustomerList';

import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
    publish
} from 'lightning/messageService';

export default class CustomerList extends LightningElement {
    @api sobject;
    customers;
    errorMsg;
    msgForUser;
    wiredRecords;

    subscription = null;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            FLOW_STATUS_CHANGE_MC,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        if (
            message.flowName === 'createReservation' &&
            message.status === 'FINISHED' &&
            message.state
        ) {
            if (message.state.sobjecttype === this.sobject) {
                refreshApex(this.wiredRecords);
            }
        }
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    @wire(getCustomerList, { sObjectType: '$sobject' })
    wiredCustomerData(value) {
        this.wiredRecords = value;
        if (value.error) {
            this.errorMsg = value.error;
            this.msgForUser = 'There was an issue loading customers.';
        } else if (value.data) {
            this.customers = value.data;
        }
    }

    publishSelect(event) {
        const payload = { tileType: 'customer', properties: event.detail };
        publish(this.messageContext, TILE_SELECTION_MC, payload);
    }
}
