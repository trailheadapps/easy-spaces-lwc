import { LightningElement, api } from 'lwc';

export default class PillList extends LightningElement {
    _pills;

    @api
    set pills(values) {
        if (Array.isArray(values)) {
            this._pills = values.map((value) => {
                return {
                    label: value,
                    selected: false
                };
            });
        } else {
            this._pills = [];
        }
    }
    get pills() {
        return this._pills;
    }

    handleClick(event) {
        const label = event.target.label;
        this._pills = this._pills.map((pill) => {
            if (pill.label === label) {
                return Object.assign({}, pill, { selected: !pill.selected });
            }
            return pill;
        });
        this.fireFiltersChangeEvent();
    }

    fireFiltersChangeEvent() {
        const pillLabels = this._pills
            .filter((pill) => pill.selected)
            .map((pill) => pill.label);
        this.dispatchEvent(
            new CustomEvent('filterschange', {
                detail: {
                    filters: pillLabels
                }
            })
        );
    }
}
