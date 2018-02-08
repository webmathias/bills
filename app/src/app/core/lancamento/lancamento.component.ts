import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {EntryService} from "../../core/entry/entry.service";
import {CategoryService} from "../../core/category/category.service";
import {BankService} from "../../core/bank/bank.service";
import {entry} from "../entry/entry.model";
import {category} from "../category/category.model";
import {bank} from "../bank/bank.model";

declare var $:any;
@Component({
    selector: 'lancamento',
    templateUrl: 'lancamento.component.html',
    styleUrls: ['lancamento.component.css']
})
export class Lancamento {
    public novos: Array<entry> = [];
    public categories: Array<category> = []
    public banks: Array<bank> = []
    form: FormGroup;
    constructor(public entryService:EntryService, public categoriyService:CategoryService, public bankService:BankService) {
        categoriyService.getCategorys().subscribe(data => this.categories = data)
        bankService.getBanks().subscribe(data => this.banks= data)
        this.form = new FormBuilder().group({});
        this.newEntry();
        this.newEntry();
        this.newEntry();
    };

    remove(item: entry) {
        var idx = this.novos.indexOf(item);
        if (idx >= 0)
            this.novos.splice(idx, 1);
    }
    newEntry(){
        this.novos.push(new entry());
    }
    save() {
        if(this.novos.length == 0 ) return;
        let tmp:entry = this.novos.pop();
        if(tmp.value == 0) return this.save();
        this.entryService.save(tmp).subscribe(()=>{
            this.save();
        });
    }

}
