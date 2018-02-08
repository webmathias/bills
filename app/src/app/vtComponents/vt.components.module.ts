/**
 * Created by mathias on 29/11/16.
 */
import {NgModule, Pipe, PipeTransform}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


import {VTDataTableComponent, ColumnValue} from './datatable/vt.datatable.component';
import {VTFormComponent} from './form/vt.form.component';
import {VTColumnTypes, NumberFormatPipe, VTFieldTypes, DateFormatPipe} from './common/defines';
import {
  VTFieldNumberComponent,
  VTFieldDateComponent,
  VTFieldTextComponent,
  VTFieldCurrencyComponent,
  VTFieldBooleanComponent,
  VTFieldSelectComponent, VTFieldComponent
} from './form/vt-field.component';
import {VTDataTableSelectComponent} from './datatable/vt.datatableselect.component';
import {VTColumntComponent} from './datatable/vt-column.component';
import {TranslateModule} from "ng2-translate";
// import { NgDatepickerModule } from 'ng2-datepicker';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, JsonpModule,TranslateModule],
    declarations: [VTFieldComponent, VTFieldSelectComponent,VTFieldDateComponent, VTFieldNumberComponent, VTFieldBooleanComponent, VTFieldCurrencyComponent, VTFormComponent, VTFieldTextComponent, VTDataTableComponent, VTColumntComponent, VTDataTableSelectComponent, NumberFormatPipe,DateFormatPipe, ColumnValue],
    exports: [VTFieldComponent, VTFieldSelectComponent,VTFieldDateComponent, VTFieldNumberComponent, VTFieldBooleanComponent, VTFieldCurrencyComponent, VTFormComponent, VTFieldTextComponent, VTDataTableComponent, VTColumntComponent, VTDataTableSelectComponent, NumberFormatPipe,DateFormatPipe],
    bootstrap: []
})
export class VTComponentsModule {
}
