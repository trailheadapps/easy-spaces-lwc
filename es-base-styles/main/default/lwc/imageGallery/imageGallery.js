import { LightningElement, api } from 'lwc';
export default class ImageGallery extends LightningElement {
    _items = [];

    @api
    set items(values) {
        if (Array.isArray(values)) {
            this._items = values.map((value) => {
                return {
                    record: value.record,
                    muted: value.muted,
                    selected: false
                };
            });
        } else {
            this._items = [];
        }
    }
    get items() {
        return this._items;
    }

    handleClick(event) {
        const id = event.target.record.Id;
        this._items = this._items.map((item) => {
            if (item.record.Id === id) {
                return Object.assign({}, item, { selected: !item.selected });
            } else if (item.selected) {
                return Object.assign({}, item, { selected: false });
            }
            return item;
        });

        this.dispatchEvent(
            new CustomEvent('itemselect', {
                detail: { recordId: id }
            })
        );
    }
}
