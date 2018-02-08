import {
    Component,
    Input,
    QueryList,
    ContentChildren,
    AfterViewInit,
    EventEmitter,
    Output
} from '@angular/core';
import {VTFieldComponent, VTFieldTextComponent} from "./vt-field.component";
import {FormBuilder} from "@angular/forms";
import {VTFieldTypes} from '../common/defines';

@Component({
    selector: 'vt-form',
    templateUrl: './form.html',

    styleUrls: ['./form.css']
})
export class VTFormComponent<T> implements AfterViewInit {
    // @ContentChildren('*')
    // columns: QueryList<VTFieldComponent>;
    // @ContentChildren(VTFieldTextComponent)
    // columns1: QueryList<VTFieldTextComponent>;
    @Input() list: Array<T>;
    @Input() class: String = '';
    @Input() label: String;
    constructor() {
    };


    ngAfterViewInit() {


    }


}