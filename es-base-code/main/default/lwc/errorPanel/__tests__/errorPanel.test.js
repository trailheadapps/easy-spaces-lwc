import { createElement } from 'lwc';
import ErrorPanel from 'c/errorPanel';

describe('c-error-panel', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('error panel with noDataIllustration template', () => {
        it('displays a default friendly message', () => {
            const MESSAGE = 'Error retrieving data';

            // Create initial element
            const element = createElement('c-error-panel', {
                is: ErrorPanel
            });
            document.body.appendChild(element);

            const messageEl = element.shadowRoot.querySelector('h3');
            expect(messageEl.textContent).toBe(MESSAGE);
        });

        it('displays a custom friendly message', () => {
            const MESSAGE = 'Errors are bad';

            // Create initial element
            const element = createElement('c-error-panel', {
                is: ErrorPanel
            });
            element.friendlyMessage = MESSAGE;
            document.body.appendChild(element);

            const messageEl = element.shadowRoot.querySelector('h3');
            expect(messageEl.textContent).toBe(MESSAGE);
        });
    });

    describe('error panel with inlineMessage template', () => {
        it('displays a default friendly message', () => {
            const MESSAGE = 'Error retrieving data';
            const OUTPUT_MESSAGE = MESSAGE + '.';

            // Create initial element
            const element = createElement('c-error-panel', {
                is: ErrorPanel
            });
            element.type = 'inlineMessage';
            document.body.appendChild(element);

            const messageEl = element.shadowRoot.querySelector('span');
            expect(messageEl.textContent).toBe(OUTPUT_MESSAGE);
        });

        it('displays a custom friendly message', () => {
            const MESSAGE = 'Errors are bad';
            const OUTPUT_MESSAGE = MESSAGE + '.';

            // Create initial element
            const element = createElement('c-error-panel', {
                is: ErrorPanel
            });
            element.friendlyMessage = MESSAGE;
            element.type = 'inlineMessage';
            document.body.appendChild(element);

            const messageEl = element.shadowRoot.querySelector('span');
            expect(messageEl.textContent).toBe(OUTPUT_MESSAGE);
        });
    });

    it('doesnt display errors on load when they are passed as parameters', () => {
        const ERROR_MESSAGES_INPUT = [
            { message: 'First bad error' },
            { message: 'Second bad error' }
        ];

        // Create initial element
        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const messageTexts = Array.from(
                element.shadowRoot.querySelectorAll('p')
            ).map((errorMessage) => (errorMessage = errorMessage.textContent));
            expect(messageTexts.length).toEqual(0);
        });
    });

    it('displays error details on button click when they passed as parameters', () => {
        const ERROR_MESSAGES_INPUT = [
            { message: 'First bad error' },
            { message: 'Second bad error' }
        ];
        const ERROR_MESSAGES_OUTPUT = ['First bad error', 'Second bad error'];

        // Create initial element
        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        let anchorEl = element.shadowRoot.querySelector('a');
        anchorEl.click();

        return Promise.resolve().then(() => {
            const messageTexts = Array.from(
                element.shadowRoot.querySelectorAll('p')
            ).map((errorMessage) => (errorMessage = errorMessage.textContent));
            expect(messageTexts).toEqual(ERROR_MESSAGES_OUTPUT);
        });
    });

    it('is accessible when inline message', () => {
        const ERROR_MESSAGES_INPUT = [
            { message: 'First bad error' },
            { message: 'Second bad error' }
        ];

        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });

        element.type = 'inlineMessage';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Click link to show details
        element.shadowRoot.querySelector('a').click();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no data illustration', () => {
        const ERROR_MESSAGES_INPUT = [
            { message: 'First bad error' },
            { message: 'Second bad error' }
        ];

        const element = createElement('c-error-panel', {
            is: ErrorPanel
        });

        element.type = 'noDataIllustration';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Click link to show details
        element.shadowRoot.querySelector('a').click();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
