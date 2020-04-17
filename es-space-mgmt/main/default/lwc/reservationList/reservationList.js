import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpenReservations from '@salesforce/apex/reservationManagerController.getOpenReservations';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class ReservationList extends LightningElement {
    wiredResult;
    reservationSelected = false;
    selectedRecId;
    _records = [];
    reservations;
    errorMsg;
    msgForUser;
    noRecords = false;
    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('flowexit', this.handleFlowExit, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
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

    handleFlowExit() {
        return refreshApex(this.wiredResult);
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
        fireEvent(this.pageRef, 'selectreservation', { detail: event.detail });
        this.handleMute();
    }
}
