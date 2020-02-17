import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class ReservationHelper extends LightningElement {
    /*
     *   Component coordinates event comms between Aura-based parent component
     *   and LWC-based siblings. Uses pubsub as replacement for ltng:selectSObject event.
     *   TO DO: Replace Aura parent component when support for LWC flow screens available.
     */

    flowStarted = false;
    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('selectcustomer', this.handleCustomerSelect, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleCustomerSelect(event) {
        if (!this.flowStarted) {
            this.flowStarted = true;
            this.dispatchEvent(
                new CustomEvent('customerchoice', { detail: event.detail })
            );
        } else if (this.flowStarted) {
            const toastEvt = new ShowToastEvent({
                title: 'Flow interview already in progress',
                message:
                    'Finish the flow interview in progress before selecting another customer.',
                variant: 'error'
            });
            this.dispatchEvent(toastEvt);
        }
    }

    @api
    handleFlowExit(event) {
        fireEvent(this.pageRef, 'flowfinish', event);
    }
}
