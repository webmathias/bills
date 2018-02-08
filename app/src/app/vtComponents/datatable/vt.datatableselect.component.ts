import {
    Component,
    Output,
    EventEmitter,
    Input,
    Pipe,
    PipeTransform,
    QueryList,
    ContentChildren,
    OnChanges,
    SimpleChange
} from '@angular/core';
import {VTColumntComponent} from "./vt-column.component";
import {VTColumnTypes} from "../common/defines";
import {VTDataTableComponent} from "./vt.datatable.component";

@Component({
    selector: 'vt-datatable-select',
    templateUrl: './datatableselect.html',
    styleUrls: ['./datatable.css']

})
export class VTDataTableSelectComponent<T> extends VTDataTableComponent<T> {
    @ContentChildren(VTColumntComponent) columns: QueryList<VTColumntComponent>;
    @Input() list: Array<T>;
    @Input() class: string = '';
    @Input() label: string;
    @Output('add') add = new EventEmitter();
    @Output('remove') remove = new EventEmitter();
    @Output('edit') edit = new EventEmitter();

    @Input() set filter(newFilter: string) {
        console.log('newFilter', newFilter);
        console.log('newFilter', this._listoriginal.length);
        if (!newFilter) {
            this._list = this._listoriginal;
            return;
        }
        newFilter = newFilter.toLowerCase();
        this._list = this._listoriginal.filter((t: T) => {
            var keys = Object.keys(t);
            for (var i = 0; i < keys.length; i++) {
                if(keys[i] === '_id') continue;
                var a =  (t[keys[i]]+'').toLowerCase();
                if (a.indexOf(newFilter) >= 0)
                    return t;
            }
        });
        this.updatePages();
        this.setPage(0);
    }

    public _selectedall: Boolean = false;
    public _selectedCount: number = 0;

    constructor() {
        super();
    };

    setPage(page: number) {
        if (!page) return;
        for (let entry of this.listCurrentPage) {
            entry['_selected'] = false;
        }
        super.setPage(page);
        this._selectedCount = 0;
        this._selectedall = false;
    }

    _select(item: T) {
        if (!item['_selected'])
            this._selectedall = false;
        this._selectedCount += item['_selected'] ? +1 : -1;
    }

    _add(event: any) {
        if (this.add)
            this.add.emit({
                value: event
            });
    }

    _remove(event: any) {
        if (this.remove) {
            let selected: Array<T> = new Array();
            for (let entry of this.list) {
                if (entry['_selected']) {
                    selected.push(entry);
                }
            }
            this._selectedCount = 0;
            this.remove.emit(selected);
        }
    }

    _edit(item: any) {
        if (this.edit) {
            let selected: any = undefined;
            for (let entry of this.list) {
                if (entry['_selected']) {
                    selected = entry;
                }
            }
            this.edit.emit(selected);
        }
    }

    _selectAll() {
        for (let entry of this.listCurrentPage) {
            entry['_selected'] = !this._selectedall;
        }
        this._selectedCount = !this._selectedall ? this.list.length : 0;
    }
}
