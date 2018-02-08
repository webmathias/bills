import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';
import {BankService} from "../../core/bank/bank.service";
import {FileUploader, FileItem} from 'ng2-file-upload';
import {EntryService} from "../../core/entry/entry.service";
import {CategoryService} from "../../core/category/category.service";
import {bank} from "../bank/bank.model";
import {entry} from "../entry/entry.model";
import {category} from "../category/category.model";
import * as c3 from 'c3';
import * as d3 from 'd3';
import {forEach} from "@angular/router/src/utils/collection";
declare var $: any;
@Component({
  selector: 'chart-resumo-categoria',
  template: ''
})

export class ChartResumoCategoria implements AfterViewInit {
  private chart: any;
  private element: any;

  @Input()
  public set data(data) {
    console.log(data);
    if (data && data.length > 0) {
      // var tounload = []
      // if (this.chart) {
      //   for (var i = 0; i < this.internalData.length; i++) {
      //     tounload.push(this.internalData[i][0])
      //   }
      // }
      this.internalData = [];
      for (var i = 0; i < data.length; i++) {
        var v = data[i];
        if(v._id.category.name.indexOf("Transferências") >= 0){
          continue;
        }
        var t = v.value.saidaConfirmada;
        if (t < 0) {
          t = t * -1;
          this.internalData.push([v._id.category.name, t]);
          // tounload = tounload.filter(obj => obj !== v._id.category.name);
        }

      }
        this.chart = c3.generate({
          bindto: this.element,
          size: {
            width: 400,
            height: 400
          },
          data: {
            columns: this.internalData,
            type: 'pie',
          }
        });
    }else{
      this.chart = c3.generate({
        bindto: this.element,
        size: {
          width: 400,
          height: 400
        },
        data: {
          columns: this.internalData,
          type: 'pie',
        }
      });
    }
  };

  public internalData: Array<any> = [];

  ngAfterViewInit() {


  }

  constructor(myElement: ElementRef, public entryService: EntryService) {
    this.element = myElement.nativeElement;
  };

}
