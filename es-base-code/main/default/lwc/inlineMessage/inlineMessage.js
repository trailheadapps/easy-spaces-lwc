import { LightningElement, api, track } from 'lwc';
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

    @api
    get messageDetails() {
        return this._msgDetails;
    }
    set messageDetails(value) {
        //value can be array or singleton, normalize here
        if (!Array.isArray(value)) {
            value = [value];
        }

        // TO DO: Uncomment line below and remove workaround when W-5644412 is fixed
        // this._msgDetails = value.filter(detail => detail && detail.message);
        // W-5644412 workaround
        this._msgDetails = value
            //handle both imperative Apex and @wire message shapes
            .filter(
                msg =>
                    (msg && msg.body && msg.body.message) ||
                    (msg &&
                        msg.details &&
                        msg.details.body &&
                        msg.details.body.message),
            )
            .map(msg => ({
                message: msg.body ? msg.body.message : msg.details.body.message,
            }));
    }

    handleVariantCheck(value) {
        if (VARIANT_TYPES.includes(value)) {
            this.iconVariant = value;
        }
    }
}
