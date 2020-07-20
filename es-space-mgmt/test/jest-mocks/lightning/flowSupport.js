export const FlowNavigationNextEventName = 'lightning__flownavigationnext';

export class FlowNavigationNextEvent extends CustomEvent {
    constructor() {
        super(FlowNavigationNextEventName, {
            composed: true,
            cancelable: true,
            bubbles: true
        });
    }
}
