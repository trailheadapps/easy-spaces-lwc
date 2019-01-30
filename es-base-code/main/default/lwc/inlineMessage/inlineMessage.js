import { LightningElement, api, track } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';

const VARIANT_TYPES = ['success', 'error', 'warning', 'info'];

export default class InlineMessage extends LightningElement {
    /*
     * Component displays system-generated error messages and utility icons.
     * TO DO: Edit comment just below to reflect final system message format.
     * To display custom messages, assign text to a 'details.body.message' attribute.
     */

    _iconName;
    _msgDetails;
    @track altText;
    @track iconVariant = '';
    @api iconSize;
    @api msgForUser;
    @api showDetails;

    @api
    get iconName() {
        return 'utility:' + this._iconName;
    }
    set iconName(value) {
        let normedVal = value.toLowerCase();
        this._iconName = normedVal;
        //alt and variant attributes (if variant applies) should mirror chosen icon
        this.altText = normedVal;
        this.handleVariantCheck(normedVal);
    }

    @api messageDetails;

    get messageSummaries() {
        return reduceErrors(this.messageDetails);
    }

    handleVariantCheck(value) {
        if (VARIANT_TYPES.includes(value)) {
            this.iconVariant = value;
        }
    }
}
