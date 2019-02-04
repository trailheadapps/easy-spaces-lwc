import { LightningElement, api, track } from 'lwc';
const VARIANT_TYPES = ['success', 'error', 'warning', 'info'];
export default class InlineMessage extends LightningElement {
    /*
     * Component displays system-generated error messages, custom messages and SLDS utility icons.
     * Assign human-readable errors to the 'msgForUser' property.
     * To display other custom error details, assign text to 'messageDetails.message'.
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
        //value can be array or singleton, normalize to array
        if (!Array.isArray(value)) {
            value = [value];
        }
        const messages = value
            //eliminate empty strings & null values
            .filter(msg => !!msg)
            //extract and format details from a variety of message types
            .map(msg => {
                if (Array.isArray(msg.body)) {
                    //extract details from UI API read error array
                    let msgs = msg.body.map(b => 'Error: ' + b.message);
                    //make a readable string from the array
                    return Array.from(msgs.values()).join(', ');
                } else if (msg.body && typeof msg.body.message === 'string') {
                    //extract Apex, DML and other system errors
                    return msg.body.message;
                } else if (msg.message && typeof msg.message === 'string') {
                    //extract JS errors and custom detail messages
                    return msg.message;
                }
                //return HTTP status code if provided, else use failsafe string
                return msg.statusText ? msg.statusText : 'Unknown error';
            });
        this._msgDetails = messages;
    }

    handleVariantCheck(value) {
        if (VARIANT_TYPES.includes(value)) {
            this.iconVariant = value;
        }
    }
}
