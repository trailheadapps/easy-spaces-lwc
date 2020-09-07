import { createElement } from 'lwc';
import PillList from 'c/pillList';

const PILL_VALUES = [
    'Scheduled Activity',
    'Come-and-Go',
    'Large Groups',
    'Individuals or Small Groups',
    'Indoor',
    'Outdoor',
    'Conversation Starter',
    'Energizing',
    'Quiet',
    'Relaxing'
];

describe('c-pill-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays pills', () => {
        // Create element
        const element = createElement('c-pill-list', {
            is: PillList
        });

        element.pills = PILL_VALUES;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const pillElements = element.shadowRoot.querySelectorAll('c-pill');
            expect(pillElements.length).toBe(PILL_VALUES.length);
            expect(pillElements[0].label).toBe(PILL_VALUES[0]);
            expect(pillElements[0].selected).toBe(false);
        });
    });

    it('click on an pill marks the selected property to true, and fires an event', () => {
        const EVENT_DETAIL_PARAMETER = {
            filters: ['Scheduled Activity']
        };

        // Create element
        const element = createElement('c-pill-list', {
            is: PillList
        });

        element.pills = PILL_VALUES;
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        // Add event listener to catch child event
        element.addEventListener('filterschange', handler);

        return Promise.resolve()
            .then(() => {
                //Check for the selected property on pills
                expect(element.pills[0].selected).toBe(false);
                const pillEl = element.shadowRoot.querySelector('c-pill');
                pillEl.click();
                expect(element.pills[0].selected).toBe(true);
            })
            .then(() => {
                // Validate if event got fired
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail).toEqual(
                    EVENT_DETAIL_PARAMETER
                );
            });
    });

    it('is accessible', () => {
        const element = createElement('c-pill-list', {
            is: PillList
        });

        element.pills = PILL_VALUES;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
