import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import TILE_SELECTION_MC from '@salesforce/messageChannel/Tile_Selection__c';
import FLOW_STATUS_CHANGE_MC from '@salesforce/messageChannel/Flow_Status_Change__c';
import {
    subscribe,
    unsubscribe,
    MessageContext,
    publish
} from 'lightning/messageService';

export default class SpaceDesigner extends LightningElement {
    /*
     *   Component coordinates event comms between Aura-based parent component
     *   and LWC-based siblings. Uses LMS in place of custom Aura application event.
     *   TO DO: Replace Aura parent component when support for LWC flow screens available.
     */
    flowStarted = false;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            TILE_SELECTION_MC,
            (message) => this.handleReservationSelect(message)
        );
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    handleReservationSelect(message) {
        if (message.tileType === 'reservation') {
            if (this.flowStarted) {
                const toastEvt = new ShowToastEvent({
                    title: 'Flow interview already in progress',
                    message:
                        'Finish the flow interview in progress before selecting another reservation.',
                    variant: 'error'
                });
                this.dispatchEvent(toastEvt);
            } else {
                this.flowStarted = true;
                const choiceEvt = new CustomEvent('reservchoice', {
                    detail: message.properties
                });
                this.dispatchEvent(choiceEvt);
            }
        }
    }

    @api
    handleFlowExit() {
        const payload = { flowName: 'spaceDesigner', status: 'FINISHED' };
        publish(this.messageContext, FLOW_STATUS_CHANGE_MC, payload);
    }
}
