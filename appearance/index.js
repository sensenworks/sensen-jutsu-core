import { SensenEmitter } from "../emitter.js";
import { SensenMetricRandom } from "../metric-random.js";
export class SensenAppearance {
    constructor(props) {
        this.$dom = {};
        this.$UiD = '';
        this.$emitter = {};
        this.props = {};
        this.emit = {};
        this.$refs = {};
        this.$dom = document.createElement('style');
        this.$UiD = this.$generateUiD();
        this.$emitter = new SensenEmitter();
        this.props = props || {};
        /** * Emit Event */
        this.$emitter?.dispatch('construct', this);
        this.$emitting();
    }
    $generateUiD() {
        return `${SensenMetricRandom.CreateAplpha(12).join('')}${SensenMetricRandom.Create(20).join('')}`;
    }
    $initialize() {
        this.$dom.setAttribute('rel', 'StyleSheet');
        this.$dom.setAttribute('type', 'text/css');
        this.$dom.setAttribute('sensen-appearance', `${this.$UiD}`);
        document.head.appendChild(this.$dom);
        /** * Emit Event */
        this.$emitter?.dispatch('initialized', this);
        return this;
    }
    selector(selector, value) {
        this.props[selector] = this.props[selector] || [];
        const rank = this.props[selector].length;
        this.props[selector][rank] = value;
        /** * Emit Event */
        this.$emitter?.dispatch('selectorAdded', { selector, value, rank });
        return this;
    }
    selectors(appearance) {
        const entries = Object.entries(appearance || {});
        if (entries.length) {
            entries.map($ => ($[1] || []).map(selector => this.selector($[0], selector)));
        }
        return this;
    }
    $emitting() {
        /**
         * Custom Emitter Listener : Begin
         */
        if (this.emit) {
            Object.entries(this.emit).map(e => {
                if (typeof e[1] == 'function') {
                    const self = this;
                    this.$emitter?.listen(e[0], function () {
                        // @ts-ignore
                        e[1].apply(this, [arguments[0]]);
                    });
                }
            });
        }
        /**
         * Custom Emitter Listener : End
         */
        return this;
    }
    render(slot) {
        const e = document.createTextNode(slot);
        e.textContent = slot;
        this.$dom.appendChild(e);
        return e;
    }
    mount() {
        this.$initialize();
        /**
         * Building
         */
        if (this.props) {
            const slot = OIAppearance(this.props);
            slot.selectors.forEach((selector, k) => {
                this.$refs[selector] = this.render(`.${this.$UiD}${(selector).trim().toLocaleLowerCase() == '$self'
                    ? `` : ` ${selector}`}{${slot.rows[k]}}`);
            });
        }
        /** * Emit Event */
        this.$emitter?.dispatch('mounted', this);
        return this;
    }
}
export function OIAppearanceProp(prop) {
    const mv = prop.indexOf('-vertical');
    const mh = prop.indexOf('-horizontal');
    if (mv > -1) {
        const p = prop.substr(0, mv);
        return [`${p}-top`, `${p}-bottom`];
    }
    else if (mh > -1) {
        const p = prop.substr(0, mh);
        return [`${p}-left`, `${p}-right`];
    }
    return [prop];
}
export function OIAppearanceValue(value) {
    switch (typeof value) {
        case 'number':
            return (`${value}px`);
        case 'object':
            if (Array.isArray(value)) {
                return value.map(i => `${i}px`).join(' ');
            }
            else {
                return Object.keys(value).map(k => `${k}{ ${value[k]} }`).join(' ');
            }
        case 'string':
            return value;
    }
    return '';
}
export function OIAppearance(entries) {
    const rows = [];
    const selectors = [];
    const majRex = new RegExp("([A-Z])", "g");
    Object.entries(entries).forEach(entry => {
        Object.values(entry[0].trim().split(',')).forEach(selector => {
            selectors[selectors.length] = selector;
            const rw = [];
            entry[1].reverse().map(value => {
                Object.entries(value).map($ => {
                    Object.values($[0].trim().split(',')).map(prop => {
                        OIAppearanceProp((`${prop}`).replace(majRex, '-$&').toLowerCase()).forEach(p => {
                            rw[rw.length] = `${p}:${OIAppearanceValue($[1] || '')}`;
                        });
                    });
                });
            });
            rows[rows.length] = rw.join(';');
        });
    });
    return { selectors, rows };
}
