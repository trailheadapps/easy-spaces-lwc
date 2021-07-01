import { createElement } from 'lwc';
import SpaceDesignForm from 'c/spaceDesignForm';
import getRelatedSpaces from '@salesforce/apex/marketServices.getRelatedSpaces';

import { FlowNavigationNextEventName } from 'lightning/flowSupport';

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
const mockSpacesList = require('./data/getRelatedSpaces.json');

const MARKET_ID = '100000';

const SELECT_EVENT_DETAIL = {
    recordId: '000000'
};

describe('c-space-design-form', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    describe('displays components on load', () => {
        it('shows a 2 column layout when getRelatedSpaces wire is successfull', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve().then(() => {
                const lightningLayoutEl =
                    element.shadowRoot.querySelector('lightning-layout');
                expect(lightningLayoutEl).not.toBeNull();

                const lightningLayoutItemsEl =
                    element.shadowRoot.querySelectorAll(
                        'lightning-layout-item'
                    );
                expect(lightningLayoutItemsEl.length).toBe(2);
            });
        });

        it('shows an error panel when getRelatedSpaces wire is not successful', () => {
            const WIRE_ERROR = 'Something bad happened';

            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit error from @wire
            getRelatedSpaces.error(WIRE_ERROR);

            return Promise.resolve().then(() => {
                const errorPanelEl =
                    element.shadowRoot.querySelector('c-error-panel');
                expect(errorPanelEl).not.toBeNull();
                expect(errorPanelEl.errors.body).toBe(WIRE_ERROR);
                expect(errorPanelEl.friendlyMessage).toBe(
                    'There was an issue loading related market data.'
                );
            });
        });

        it('shows a list of spaces if wire is successful', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve().then(() => {
                const imageGalleryEl =
                    element.shadowRoot.querySelector('c-image-gallery');
                expect(imageGalleryEl).not.toBeNull();
                expect(imageGalleryEl.items.length).toBe(3);
                expect(imageGalleryEl.items[0].record).toStrictEqual(
                    mockSpacesList[0]
                );
                expect(imageGalleryEl.items[0].muted).toBeFalsy();
            });
        });

        it('shows a list of filters if wire is successfull', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });
            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve().then(() => {
                const pillListEl =
                    element.shadowRoot.querySelector('c-pill-list');
                expect(pillListEl).not.toBeNull();
                expect(pillListEl.pills.length).toBe(10);
            });
        });
    });

    describe('show/hide components on user actions', () => {
        it('clicking on a space tile shows the space details', () => {
            const OUTPUT_FIELDS = [
                'Name',
                'Maximum_Capacity__c',
                'Minimum_Capacity__c',
                'Daily_Booking_Rate__c'
            ];

            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve()
                .then(() => {
                    const imageGalleryEl =
                        element.shadowRoot.querySelector('c-image-gallery');
                    imageGalleryEl.dispatchEvent(
                        new CustomEvent('itemselect', {
                            detail: SELECT_EVENT_DETAIL
                        })
                    );
                })
                .then(() => {
                    expect(element.selectedtile).toBe(
                        SELECT_EVENT_DETAIL.recordId
                    );

                    const recordViewFormEl = element.shadowRoot.querySelector(
                        'lightning-record-view-form'
                    );
                    expect(recordViewFormEl).not.toBeNull();

                    const outputFieldNames = Array.from(
                        element.shadowRoot.querySelectorAll(
                            'lightning-output-field'
                        )
                    ).map((outputField) => outputField.fieldName);
                    expect(outputFieldNames).toEqual(OUTPUT_FIELDS);
                });
        });

        it('changing filters mutes tiles based on filter value', () => {
            const FILTER_CHANGE_EVENT_DETAIL = {
                filters: ['Outdoor']
            };

            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve()
                .then(() => {
                    const pillsEl =
                        element.shadowRoot.querySelector('c-pill-list');
                    pillsEl.dispatchEvent(
                        new CustomEvent('filterschange', {
                            detail: FILTER_CHANGE_EVENT_DETAIL
                        })
                    );
                })
                .then(() => {
                    const imageGalleryEl =
                        element.shadowRoot.querySelector('c-image-gallery');
                    expect(imageGalleryEl.items[0].muted).toBeFalsy();
                    expect(imageGalleryEl.items[1].muted).toBeFalsy();
                    expect(imageGalleryEl.items[2].muted).toBeTruthy();
                });
        });
    });

    describe('button behavior', () => {
        it('buttons are disabled when no space is selected', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve().then(() => {
                const buttonEl =
                    element.shadowRoot.querySelectorAll('lightning-button');
                expect(buttonEl[0].disabled).toBeTruthy();
                expect(buttonEl[1].disabled).toBeTruthy();
            });
        });

        it('buttons are enabled when a space is selected', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);
            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve()
                .then(() => {
                    const imageGalleryEl =
                        element.shadowRoot.querySelector('c-image-gallery');
                    imageGalleryEl.dispatchEvent(
                        new CustomEvent('itemselect', {
                            detail: SELECT_EVENT_DETAIL
                        })
                    );
                })
                .then(() => {
                    const buttonEl =
                        element.shadowRoot.querySelectorAll('lightning-button');
                    expect(buttonEl[0].disabled).toBeFalsy();
                    expect(buttonEl[1].disabled).toBeFalsy();
                });
        });

        it('clicking add space and finish triggers flow navigation event with popTabOnFinish set to false', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // listen to flow navigate event
            const handler = jest.fn();
            element.addEventListener(FlowNavigationNextEventName, handler);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve()
                .then(() => {
                    const imageGalleryEl =
                        element.shadowRoot.querySelector('c-image-gallery');
                    imageGalleryEl.dispatchEvent(
                        new CustomEvent('itemselect', {
                            detail: SELECT_EVENT_DETAIL
                        })
                    );
                })
                .then(() => {
                    const buttonEl =
                        element.shadowRoot.querySelectorAll('lightning-button');
                    buttonEl[0].click();
                })
                .then(() => {
                    expect(handler).toBeCalled();
                    expect(element.popTabOnFinish).toBeFalsy();
                });
        });

        it('clicking add space and go to reservation triggers flow navigation event with popTabOnFinish set to true', () => {
            const element = createElement('c-space-design-form', {
                is: SpaceDesignForm
            });

            element.market = MARKET_ID;
            document.body.appendChild(element);

            // listen to flow navigate event
            const handler = jest.fn();
            element.addEventListener(FlowNavigationNextEventName, handler);

            // Emit data from @wire
            getRelatedSpaces.emit(mockSpacesList);

            return Promise.resolve()
                .then(() => {
                    const imageGalleryEl =
                        element.shadowRoot.querySelector('c-image-gallery');
                    imageGalleryEl.dispatchEvent(
                        new CustomEvent('itemselect', {
                            detail: SELECT_EVENT_DETAIL
                        })
                    );
                })
                .then(() => {
                    const buttonEl =
                        element.shadowRoot.querySelectorAll('lightning-button');
                    buttonEl[1].click();
                })
                .then(() => {
                    expect(handler).toBeCalled();
                    expect(element.popTabOnFinish).toBeTruthy();
                });
        });
    });

    it('is accessible when related spaces returned', () => {
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });

        document.body.appendChild(element);

        // Emit data from @wire
        getRelatedSpaces.emit(mockSpacesList);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when tile selected', () => {
        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });

        element.market = MARKET_ID;
        document.body.appendChild(element);

        // Emit data from @wire
        getRelatedSpaces.emit(mockSpacesList);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error returned', () => {
        const WIRE_ERROR = 'Something bad happened';

        const element = createElement('c-space-design-form', {
            is: SpaceDesignForm
        });

        element.market = MARKET_ID;
        document.body.appendChild(element);

        // Emit error from @wire
        getRelatedSpaces.error(WIRE_ERROR);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
