import { createElement } from 'lwc';
import Pill from 'c/pill';

const MOCK_LABEL = 'mockLabel';

describe('c-pill', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays the right label', () => {
        const element = createElement('c-pill', {
            is: Pill
        });
        element.label = MOCK_LABEL;
        document.body.appendChild(element);

        const pill = element.shadowRoot.querySelector('span.slds-pill__label');

        expect(pill.textContent).toBe(MOCK_LABEL);
    });

    it('is accessible', () => {
        const element = createElement('c-pill', {
            is: Pill
        });

        element.label = MOCK_LABEL;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
