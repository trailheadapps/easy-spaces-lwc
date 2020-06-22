import { createElement } from 'lwc';
import getRelatedSpaces from '@salesforce/apex/marketServices.getRelatedSpaces';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import { FlowNavigationNextEventName } from 'lightning/flowSupport';
import SpaceDesignForm from 'c/spaceDesignForm';

// Realistic data with a list of spaces
const mockRelatedSpaceRecords = require('./data/getRelatedSpaces.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getRelatedSpacesAdapter = registerApexTestWireAdapter(getRelatedSpaces);

describe('c-space-design-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('getRelatedSpaces @wire data and do not select any tile', () => {
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });
        element.market = 'Minneapolis - MN';
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpacesAdapter.emit(mockRelatedSpaceRecords);
        return Promise.resolve().then(() => {
            const pillList = element.shadowRoot.querySelector('c-pill-list');
            expect(pillList.pills.length).toBe(10);
            const paragraphElement = element.shadowRoot.querySelector('p');
            expect(paragraphElement.textContent).toBe(
                'Select a space to see details.'
            );
            const imageGalleryElement = element.shadowRoot.querySelector(
                'c-image-gallery'
            );
            expect(imageGalleryElement.items.length).toBe(
                mockRelatedSpaceRecords.length
            );
        });
    });

    it('select an item tile for design', () => {
        const RECORDID = '0031700000pJRRSAA4';
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });
        element.market = 'Minneapolis - MN';
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpacesAdapter.emit(mockRelatedSpaceRecords);
        return Promise.resolve().then(() => {
            const imageGalleryElement = element.shadowRoot.querySelector(
                'c-image-gallery'
            );
            expect(imageGalleryElement.items.length).toBe(
                mockRelatedSpaceRecords.length
            );
            imageGalleryElement.dispatchEvent(
                new CustomEvent('itemselect', {
                    detail: { recordId: RECORDID }
                })
            );
            Promise.resolve().then(() => {
                expect(element.selectedtile).toBe(RECORDID);
                const recordFormElement = element.shadowRoot.querySelector(
                    'lightning-record-view-form'
                );
                expect(recordFormElement.recordId).toBe(RECORDID);
                expect(recordFormElement.objectApiName).toBe('Space__c');
            });
        });
    });

    it('change filter on pills', () => {
        const FILTERS = ['Energizing'];
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });
        element.market = 'Minneapolis - MN';
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpacesAdapter.emit(mockRelatedSpaceRecords);
        return Promise.resolve().then(() => {
            const pillList = element.shadowRoot.querySelector('c-pill-list');
            pillList.dispatchEvent(
                new CustomEvent('filterschange', {
                    detail: { filters: FILTERS }
                })
            );
            Promise.resolve().then(() => {
                const imageGalleryElement = element.shadowRoot.querySelector(
                    'c-image-gallery'
                );
                expect(imageGalleryElement.items.length).toBe(
                    mockRelatedSpaceRecords.length
                );
            });
        });
    });

    it('add space and finish flow', () => {
        const RECORDID = '0031700000pJRRSAA4';
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });
        element.market = 'Minneapolis - MN';
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpacesAdapter.emit(mockRelatedSpaceRecords);
        // listen to flow navigate event
        const handler = jest.fn();
        element.addEventListener(FlowNavigationNextEventName, handler);
        return Promise.resolve().then(() => {
            const imageGalleryElement = element.shadowRoot.querySelector(
                'c-image-gallery'
            );
            imageGalleryElement.dispatchEvent(
                new CustomEvent('itemselect', {
                    detail: { recordId: RECORDID }
                })
            );
            Promise.resolve().then(() => {
                const addSpaceButton = element.shadowRoot.querySelectorAll(
                    'lightning-button'
                );
                addSpaceButton[0].click();
                Promise.resolve().then(() => {
                    expect(handler).toHaveBeenCalled();
                });
            });
        });
    });

    it('add and Go To Reservation', () => {
        const RECORDID = '0031700000pJRRSAA4';
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });
        element.market = 'Minneapolis - MN';
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpacesAdapter.emit(mockRelatedSpaceRecords);
        // listen to flow navigate event
        const handler = jest.fn();
        element.addEventListener(FlowNavigationNextEventName, handler);
        return Promise.resolve().then(() => {
            const imageGalleryElement = element.shadowRoot.querySelector(
                'c-image-gallery'
            );
            imageGalleryElement.dispatchEvent(
                new CustomEvent('itemselect', {
                    detail: { recordId: RECORDID }
                })
            );
            Promise.resolve().then(() => {
                const addSpaceButton = element.shadowRoot.querySelectorAll(
                    'lightning-button'
                );
                addSpaceButton[1].click();
                Promise.resolve().then(() => {
                    expect(handler).toHaveBeenCalled();
                    expect(element.popTabOnFinish).toBe(true);
                });
            });
        });
    });

    it('shows error panel element', () => {
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });
        element.market = 'Minneapolis - MN';
        document.body.appendChild(element);

        // Emit error from @wire
        getRelatedSpacesAdapter.error();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.friendlyMessage).toBe(
                'There was an issue loading related market data.'
            );
        });
    });
});
