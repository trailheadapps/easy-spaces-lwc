import { LightningElement, api } from 'lwc';
import getCustomerFields from '@salesforce/apex/customerServices.getCustomerFields';
const STATE_FIELD_LABEL = 'State';

export default class CustomerDetailForm extends LightningElement {
    @api sobjecttype;
    @api recordid;
    detailfields;
    errorMsg;
    msgForUser;

    connectedCallback() {
        this.getDetailFields();
    }

    getDetailFields() {
        if (this.sobjecttype) {
            getCustomerFields({ objectType: this.sobjecttype })
                .then((result) => {
                    this.detailfields = Object.values(result);
                })
                .catch((error) => {
                    this.errorMsg = error;
                    this.msgForUser =
                        'There was an issue loading customer data.';
                });
        }
    }

    handleSavedRecord(event) {
        let stateVal;
        for (let value in event.detail.fields) {
            if (value.includes(STATE_FIELD_LABEL)) {
                stateVal = event.detail.fields[value].value;
            }
        }
        const saveEvent = new CustomEvent('customerupdate', {
            detail: stateVal
        });
        this.dispatchEvent(saveEvent);
    }

    handleDraft() {
        const draftevt = new CustomEvent('draftreservation');
        this.dispatchEvent(draftevt);
    }
}
