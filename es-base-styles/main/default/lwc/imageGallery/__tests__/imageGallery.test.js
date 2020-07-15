import { createElement } from 'lwc';
import ImageGallery from 'c/imageGallery';

// Realistic data with a list of spaces
const mockSpacesList = require('./data/getRelatedSpaces.json');

describe('c-image-gallery', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays image tiles', () => {
        // Create element
        const element = createElement('c-image-gallery', {
            is: ImageGallery
        });

        element.items = mockSpacesList;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const lightningLayoutEl = element.shadowRoot.querySelector(
                'lightning-layout'
            );
            expect(lightningLayoutEl).not.toBeNull();

            const imageTileElements = element.shadowRoot.querySelectorAll(
                'c-image-tile'
            );
            expect(imageTileElements.length).toBe(mockSpacesList.length);
        });
    });

    it('click on an image tile', () => {
        // Create element
        const element = createElement('c-image-gallery', {
            is: ImageGallery
        });

        element.items = mockSpacesList;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const lightningLayoutEl = element.shadowRoot.querySelector(
                'lightning-layout'
            );
            expect(lightningLayoutEl).not.toBeNull();

            const imageTileElement = element.shadowRoot.querySelector(
                'c-image-tile'
            );

            imageTileElement.click();
            expect(element.items[0].selected).toBe(true);

            imageTileElement.click();
            expect(element.items[0].selected).toBe(false);
        });
    });
});
