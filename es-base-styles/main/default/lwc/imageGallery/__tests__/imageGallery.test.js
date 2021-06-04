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
            const imageTileElements =
                element.shadowRoot.querySelectorAll('c-image-tile');
            expect(imageTileElements.length).toBe(mockSpacesList.length);

            expect(imageTileElements[0].record.Name).toBe(
                mockSpacesList[0].record.Name
            );
            expect(imageTileElements[0].record.Picture_URL__c).toBe(
                mockSpacesList[0].record.Picture_URL__c
            );
        });
    });

    it('clicking on a tile once selects it and de-selects it once clicked again', () => {
        // Create element
        const element = createElement('c-image-gallery', {
            is: ImageGallery
        });

        element.items = mockSpacesList;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const imageTileElement =
                element.shadowRoot.querySelector('c-image-tile');

            imageTileElement.click();
            expect(element.items[0].selected).toBeTruthy();

            imageTileElement.click();
            expect(element.items[0].selected).toBeFalsy();
        });
    });

    it('clicking on an image tile fires a custom event', () => {
        const EVENT_DETAIL_PARAMETER = { recordId: '0000000000' };

        // Create element
        const element = createElement('c-image-gallery', {
            is: ImageGallery
        });

        element.items = mockSpacesList;
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        // Add event listener to catch child event
        element.addEventListener('itemselect', handler);

        return Promise.resolve()
            .then(() => {
                const imageTileElement =
                    element.shadowRoot.querySelector('c-image-tile');
                imageTileElement.click();
            })
            .then(() => {
                expect(handler).toHaveBeenCalled();
                expect(handler.mock.calls[0][0].detail).toEqual(
                    EVENT_DETAIL_PARAMETER
                );
            });
    });

    it('is accessible', () => {
        const element = createElement('c-image-gallery', {
            is: ImageGallery
        });

        element.items = mockSpacesList;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
