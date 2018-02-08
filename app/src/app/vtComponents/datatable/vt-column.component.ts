import { Component, Input } from '@angular/core';
import {VTColumnTypes} from '../common/defines';
@Component({
    selector: 'vt-column',
    template: './column{{name}}'
})
export class VTColumntComponent  {
    @Input() name:String;
    @Input() label:String;
    @Input() type:VTColumnTypes;

    constructor(){

    };
}
