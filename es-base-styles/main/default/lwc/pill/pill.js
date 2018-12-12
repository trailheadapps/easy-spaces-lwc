import { LightningElement, api } from 'lwc';

export default class Pill extends LightningElement {
    @api label;
    @api selected;

    get cssClass() {
        return 'slds-pill es-pill' + (this.selected ? ' selected' : '');
    }
}
