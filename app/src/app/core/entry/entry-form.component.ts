import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {EntryService} from './entry.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CategoryService} from "../category/category.service";
import {BankService} from "../bank/bank.service";
import {entry} from "./entry.model";
import {category} from "../category/category.model";
import {bank} from "../bank/bank.model";

declare var $: any;
@Component({
  selector: 'entry-form',
  templateUrl: 'entry-form.component.html',
  styleUrls: ['entry.component.css'],
  providers: [EntryService]
})
export class EntryFormComponent implements OnInit {
  model: entry;
  form: FormGroup;
  categories: Array<category> = [];
  banks: Array<bank> = [];
  // date:DateModel;
  ngOnInit() {
    // $(function () {
    //     var elem = $("div[type=date] input");
    //     console.log(elem);
    //     elem.datepicker({
    //         dateFormat: "yy-mm-dd",
    //         altField":"div[type=date] input",
    //
    //     })
    //     ;
    // });
  }


  constructor(public entryService: EntryService,
              private router: Router,
              private route: ActivatedRoute,
              private categoriyService: CategoryService,
              private bankService: BankService) {
    categoriyService.getCategorys().subscribe(data => this.categories = data)
    bankService.getBanks().subscribe(data => this.banks = data)
    this.model = new entry();
    this.form = new FormBuilder().group({});
    if (this.route.params['value']['id']) {
      this.entryService.get(this.route.params['value']['id']).subscribe(_ => this.model = _);
    }

  };

  save(model: entry) {
    // model.date = new Date(this.date.formatted);
    this.entryService.save(model).subscribe(aa => {
      this.router.navigateByUrl('menu/entry');
    });

  }
}
