import {Component, Input, forwardRef, AfterViewInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';


import {VTFieldTypes} from '../common/defines';
const noop = () => {
};

@Component({
    selector: 'vt-field',
    template: '',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldComponent),
        multi: true
    }]
})
export class VTFieldComponent implements ControlValueAccessor, AfterViewInit {
    @Input() name: String;
    @Input() label: String;
    @Input() type: VTFieldTypes;

    constructor() {
    };

    //The internal data model
    private innerValue: any = '';

    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {return this.innerValue;
    };

    ngAfterViewInit() {
        // this.innerValue = this.value;
    }

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {

        if (value !== this.innerValue) {
            this.innerValue = value;
        }

    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}
@Component({
    selector: 'vt-field-text',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldTextComponent),
        multi: true
    }],
    template: `<form>
        <div class="field">
        <label>{{label}}</label>
        <input name="aaa" type="text" [(ngModel)]="value"  placeholder="{{label}}"></div></form>`,

})
export class VTFieldTextComponent extends VTFieldComponent {

    constructor() {
        super();
    };
}
@Component({
    selector: 'vt-field-number',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldNumberComponent),
        multi: true
    }],
    template: '<div class="field"> <label>{{label}}</label><input  type="text" placeholder="{{label}}" [(ngModel)]="value"></div>'
})
export class VTFieldNumberComponent extends VTFieldComponent {

    constructor() {
        super();
    };
}
@Component({
    selector: 'vt-field-date',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldDateComponent),
        multi: true
    }],
    template: '<div class="field" type="date"> <label>{{label}}:<small>{{value | dateformat}}</small></label><input type="date"  name="{{name}}" [(ngModel)]="value"></div>'
})
export class VTFieldDateComponent extends VTFieldComponent implements AfterViewInit {
    ngAfterViewInit(): void {

    }

    constructor() {
        super();
    };
}
@Component({
    selector: 'vt-field-currency',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldCurrencyComponent),
        multi: true
    }],
    template: '<div class="field"> <label>{{label}}</label><input    placeholder="{{label}}" type="number" [(ngModel)]="value"></div>'
})
export class VTFieldCurrencyComponent extends VTFieldComponent {

    constructor() {
        super();
    };
}
@Component({
    selector: 'vt-field-boolean',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldBooleanComponent),
        multi: true
    }],
    template: `<div class="field">
      <div class="ui toggle checkbox">
        <input [(ngModel)]="value" type="checkbox" >
        <label>{{label}}</label>
      </div>
    </div>`
})
export class VTFieldBooleanComponent extends VTFieldComponent {

    constructor() {
        super();
    };
}
@Component({
    selector: 'vt-field-select',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VTFieldSelectComponent),
        multi: true
    }],
    template: `<div class="field">
        <label>{{label}}</label>
        <select [(ngModel)]="value">
            <option *ngFor="let item of options" [value]="item._id">{{item[optionlabel]}}</option>
        </select>
    </div>`
})
export class VTFieldSelectComponent extends VTFieldComponent {
    @Input() name: String;
    @Input() label: String;
    @Input() optionlabel: String;
    @Input() type: VTFieldTypes;
    @Input() options: Array<any>;

    constructor() {
        super();
    };
}
