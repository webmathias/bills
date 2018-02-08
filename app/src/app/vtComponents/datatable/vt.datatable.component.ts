import {
    Component,

    Input,
    QueryList,
    ContentChildren,
    AfterViewInit, Pipe, PipeTransform
} from '@angular/core';
import {VTColumntComponent} from "./vt-column.component";
import {VTColumnTypes} from "../common/defines";

@Pipe({name: 'columnValue'})
export class ColumnValue implements PipeTransform {
    transform(value: any, name: any): string {
        var keys = name.split('.');
        var tm = value;

        for(var i=0;i<keys.length;i++){
            if(tm)
                tm = tm[keys[i]];
        }
        return tm;


    }
}


@Component({
    selector: 'vt-datatable',
    templateUrl: './datatable.html',
    styleUrls: ['./datatable.css']
})
export class VTDataTableComponent<T> implements AfterViewInit {
    @ContentChildren(VTColumntComponent) columns: QueryList<VTColumntComponent>;
    // @Input() list: Array<T>;
    @Input() class: string = '';
    @Input() label: string;
    @Input() perPage: number = 50;
    _pages: Array<number> = new Array<number>();
    _currentPage: number = 1;
    _totalPages: number = 0;
    _list: Array<T> = new Array();
    _listoriginal: Array<T> = new Array();
    get list() {
        return this._list;
    }

    setPage(page: number) {
        if(!page) return;
        this._currentPage = page;
        if (this._totalPages > 5) {
            this._pages = new Array();
            let qtd = this._currentPage >= this._totalPages - 3 ? 5 : 3;
            let base = this._currentPage == 1 ? 1 : (qtd === 5) ? this._totalPages - 4 : this._currentPage - 1
            for (let i = 0; i < qtd; i++) {
                this._pages[i] = i + base;
            }
            if (qtd === 3) {
                this._pages[3] = 0;
                this._pages[4] = this._totalPages;
            }
        }
    }

    get listCurrentPage() {
        let atual = (this._currentPage - 1) * this.perPage;
        return this._list.slice(atual, atual + this.perPage);
    }
    updatePages(){
        this._pages = new Array();
        this._totalPages = Math.trunc(this._list.length / this.perPage) + 1;
        if (this._totalPages <= 5) {
            for (let i = 0; i < this._totalPages; i++) {
                this._pages[i] = i + 1;
            }
        } else {
            for (let i = 0; i < 3; i++) {
                this._pages[i] = i + this._currentPage;
            }
            this._pages[3] = 0;
            this._pages[4] = this._totalPages;
        }
    }
    set list(newlist) {
        this._list = newlist;
        this._listoriginal = newlist;
        this.updatePages();
    }

    constructor() {
    };

    ngAfterViewInit() {
        let _class = function (type: VTColumnTypes) {
            if (!type) return 'colstring';
            switch (type) {
                case VTColumnTypes.Number:
                case VTColumnTypes.Currency:
                    return 'colnumber'
            }
            return 'colstring';
        }
        this.columns.forEach(function (col: any) {
            col.typeclass = _class(col.type);
            col.typeheadeclass = _class(col.type) + "_header";
        })

    }

}
