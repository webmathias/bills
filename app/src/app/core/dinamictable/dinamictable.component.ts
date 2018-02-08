import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';
import {BankService} from "../../core/bank/bank.service";
import {FileUploader, FileItem} from 'ng2-file-upload';
import {EntryService} from "../../core/entry/entry.service";
import {CategoryService} from "../../core/category/category.service";
import {bank} from "../bank/bank.model";
import {entry} from "../entry/entry.model";
import {category} from "../category/category.model";
import * as c3 from 'c3';
import {forEach} from "@angular/router/src/utils/collection";
declare var $: any;
@Component({
  selector: 'dinamictable',
  templateUrl: 'dinamictable.component.html',
  styleUrls: ['dinamictable.component.css']
})
export class DinamicTable implements AfterViewInit {
  public data: any = null;
  private element: any;

  ngAfterViewInit() {
    this.entryService.resumeTable().subscribe((data) => {

      this.data = data;
    })

  }

  constructor(myElement: ElementRef, public entryService: EntryService) {
    this.element = myElement.nativeElement;
  };

}
