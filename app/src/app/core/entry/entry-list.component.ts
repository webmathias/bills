import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {EntryService} from './entry.service';
import {entry} from "./entry.model";

@Component({
    selector: 'entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry.component.css'],
    providers: [EntryService]
})
export class EntryListComponent {
    lista: Array<entry> = [];

    constructor(private entryService: EntryService, private router: Router) {
        entryService.getEntrys().subscribe(entry => this.lista = entry);
    };

    _new() {
        this.router.navigateByUrl('menu/entry/form');

    }

    _remove(selecteds: any) {
        console.log(selecteds);
        for (let entry of selecteds) {
            this.entryService.remove(entry).subscribe(() => {
                this.entryService.getEntrys().subscribe(entry => this.lista = entry);
            });
        }

    }

    _edit(selected: any) {
        console.log(selected);
        this.router.navigate(['menu/entry/form', {id: selected._id}]);
    }
}