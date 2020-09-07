import { createElement } from 'lwc';
import ImageTile from 'c/imageTile';

const SPACE_RECORD = {
    Id: '0000000000',
    Name: 'Sample 1',
    Market__c: '000000',
    Maximum_Capacity__c: 10,
    Minimum_Capacity__c: 10,
    Picture_URL__c: 'http://someurl.com/image.jpg',
    Category__c: 'Cooking Classroom',
    Type__c: 'Large Groups;Scheduled Activity;'
};

describe('c-image-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays correct image and text', () => {
        const element = createElement('c-image-tile', {
            is: ImageTile
        });

        element.record = SPACE_RECORD;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const imgElement = element.shadowRoot.querySelector('img');
            expect(imgElement).not.toBeNull();
            expect(imgElement.src).toBe(SPACE_RECORD.Picture_URL__c);

            const nameElement = element.shadowRoot.querySelector('h2');
            expect(nameElement).not.toBeNull();
            expect(nameElement.textContent).toBe(SPACE_RECORD.Name);
        });
    });

    it('css class .muted gets added when the property muted is set to true', () => {
        const element = createElement('c-image-tile', {
            is: ImageTile
        });

        element.record = SPACE_RECORD;
        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                const divElement = element.shadowRoot.querySelector('div');
                expect(divElement.classList.contains('muted')).toBe(false);
                element.muted = true;
            })
            .then(() => {
                const divElement = element.shadowRoot.querySelector('div');
                expect(divElement.classList.contains('muted')).toBe(true);
            });
    });

    it('css class .selected gets added when the property selected is set to true', () => {
        const element = createElement('c-image-tile', {
            is: ImageTile
        });

        element.record = SPACE_RECORD;
        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                const divElement = element.shadowRoot.querySelector('div');
                expect(divElement.classList.contains('selected')).toBe(false);
                element.selected = true;
            })
            .then(() => {
                const divElement = element.shadowRoot.querySelector('div');
                expect(divElement.classList.contains('selected')).toBe(true);
            });
    });

    it('is accessible', () => {
        const element = createElement('c-image-tile', {
            is: ImageTile
        });

        element.record = SPACE_RECORD;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
