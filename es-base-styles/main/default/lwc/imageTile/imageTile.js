import { LightningElement, api } from 'lwc';

export default class ImageTile extends LightningElement {
    @api record;
    @api muted;
    @api selected;

    get cssClass() {
        return (
            'slds-box slds-box_xx-small es-tile' +
            (this.muted ? ' muted' : '') +
            (this.selected ? ' selected' : '')
        );
    }
}
