import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class SpaceDesigner extends LightningElement {
    /*
     *   Component coordinates event comms between Aura-based parent component
     *   and LWC-based siblings. Uses pubsub in place of custom Aura application event.
     *   TO DO: Replace Aura parent component when support for LWC flow screens available.
     */
    @track flowStarted = false;
    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener(
            'selectreservation',
            this.handleReservationSelect,
            this
        );
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleReservationSelect(event) {
        if (!this.flowStarted) {
            this.flowStarted = true;
            this.dispatchEvent(
                new CustomEvent('reservchoice', { detail: event.detail })
            );
        } else if (this.flowStarted) {
            const toastEvt = new ShowToastEvent({
                title: 'Flow interview already in progress',
                message:
                    'Finish the flow interview in progress before selecting another reservation.',
                variant: 'error'
            });
            this.dispatchEvent(toastEvt);
        }
    }

    @api
    handleFlowExit() {
        fireEvent(this.pageRef, 'flowexit');
    }
}
