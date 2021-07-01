import { createElement } from 'lwc';

import getRelatedSpaces from '@salesforce/apex/marketServices.getRelatedSpaces';
import { getNavigateCalledWith } from 'lightning/navigation';
import RelatedSpaces from 'c/relatedSpaces';

// mock apex method getRelatedSpaces
jest.mock(
    '@salesforce/apex/marketServices.getRelatedSpaces',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

// Realistic data with a list of spaces
const mockRelatedSpaceRecords = require('./data/getRelatedSpaces.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockRelatedSpacesNoRecords = require('./data/getRelatedSpacesNoRecords.json');

describe('c-related-spaces', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('getRelatedSpaces @wire data', () => {
        const RECORD_ID = '0031700000pJRRSAA4';
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });
        element.recordId = RECORD_ID;
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpaces.emit(mockRelatedSpaceRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const detailEls =
                element.shadowRoot.querySelector('c-image-gallery');
            expect(detailEls.items.length).toBe(mockRelatedSpaceRecords.length);
            expect(detailEls.items[0].record.Name).toBe(
                mockRelatedSpaceRecords[0].Name
            );
        });
    });

    it('renders No related spaces found when no record is available', () => {
        const RECORD_ID = '0031700000pJRRSAA4';
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });
        element.recordId = RECORD_ID;
        document.body.appendChild(element);
        // Emit data from @wire
        getRelatedSpaces.emit(mockRelatedSpacesNoRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const pElement = element.shadowRoot.querySelector('p');
            expect(pElement.textContent).toBe('No related spaces found.');
        });
    });

    it('shows error panel element', () => {
        // Create initial element
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRelatedSpaces.error();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.friendlyMessage).toBe(
                'There was an issue loading related market data.'
            );
        });
    });

    it('fires a record page navigation event on image click', () => {
        const NAV_RECORD_ID = '0031700000pJRRSAA4';
        const NAV_TYPE = 'standard__recordPage';
        const NAV_ACTION_NAME = 'view';
        const OBJECT_API_NAME = 'Space__c';
        // Create initial element
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getRelatedSpaces.emit(mockRelatedSpaceRecords);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                const detailEls =
                    element.shadowRoot.querySelector('c-image-gallery');
                detailEls.dispatchEvent(
                    new CustomEvent('itemselect', {
                        detail: { recordId: NAV_RECORD_ID }
                    })
                );
            })
            .then(() => {
                const { pageReference } = getNavigateCalledWith();
                expect(pageReference.type).toBe(NAV_TYPE);
                expect(pageReference.attributes.recordId).toBe(NAV_RECORD_ID);
                expect(pageReference.attributes.actionName).toBe(
                    NAV_ACTION_NAME
                );
                expect(pageReference.attributes.objectApiName).toBe(
                    OBJECT_API_NAME
                );
            });
    });

    it('is accessible when related spaces returned', () => {
        const RECORD_ID = '0031700000pJRRSAA4';
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });

        element.recordId = RECORD_ID;
        document.body.appendChild(element);

        // Emit data from @wire
        getRelatedSpaces.emit(mockRelatedSpaceRecords);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no spaces returned', () => {
        const RECORD_ID = '0031700000pJRRSAA4';
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });

        element.recordId = RECORD_ID;
        document.body.appendChild(element);

        // Emit data from @wire
        getRelatedSpaces.emit(mockRelatedSpacesNoRecords);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error returned', () => {
        const element = createElement('c-related-spaces', {
            is: RelatedSpaces
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRelatedSpaces.error();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
