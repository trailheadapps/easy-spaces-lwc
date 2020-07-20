import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpenReservations from '@salesforce/apex/reservationManagerController.getOpenReservations';

import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
    publish
} from 'lightning/messageService';

export default class ReservationList extends LightningElement {
    wiredResult;
    reservationSelected = false;
    selectedRecId;
    _records = [];
    reservations = [];
    errorMsg;
    msgForUser;
    noRecords = false;

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
            message.flowName === 'spaceDesigner' &&
            message.status === 'FINISHED'
        ) {
            refreshApex(this.wiredResult);
        }
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    @wire(getOpenReservations)
    wiredReservations(value) {
        this.wiredResult = value;
        if (value.error) {
            this.errorMsg = value.error;
            this.msgForUser = 'There was an issue loading reservations.';
        } else if (value.data) {
            if (value.data.length) {
                this._records = [...value.data];
                this.handleMute();
                if (this.noRecords) this.noRecords = false;
            } else {
                this.noRecords = true;
            }
        }
    }

    handleMute() {
        if (!this.reservationSelected) {
            let muted = '';
            this.reservations = this._records.map((record) => {
                if (this.selectedRecId) {
                    this.reservationSelected = true;
                    muted = record.Id === this.selectedRecId ? false : true;
                } else {
                    muted = false;
                }
                return { record, muted };
            });
        }
    }

    handleSelectEvent(event) {
        this.selectedRecId = event.detail.reservationId;
        const payload = { tileType: 'reservation', properties: event.detail };
        publish(this.messageContext, TILE_SELECTION_MC, payload);
        this.handleMute();
    }
}
