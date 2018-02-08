import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {BankService} from '../../core/bank/bank.service';
import {FileUploader, FileItem} from 'ng2-file-upload';
import {EntryService} from '../../core/entry/entry.service';
import {CategoryService} from '../../core/category/category.service';
import {bank} from '../bank/bank.model';
import {entry} from '../entry/entry.model';
import {category} from '../category/category.model';
import * as c3 from 'c3';
import * as d3 from 'd3';
import {forEach} from '@angular/router/src/utils/collection';

declare var $: any;
@Component({
  selector: 'chart2',
  template: ' <div  id="chart_entradas" class="eight wide column"></div>  <div  id="chart_saidas" class="eight wide column"></div>',
  // styles: ['.c3-lines{fill: none;}'],
  encapsulation: ViewEncapsulation.None
})
export class Chart2 implements AfterViewInit {
  private _selectedDate: String;
  @Input()
  get selectedDate() {
    return this._selectedDate;
  }

  set selectedDate(nvalue) {
    this._selectedDate = nvalue;
    var d = new Date(this._selectedDate+'');
    this.updateChart()
  }


  private chart1: any;
  private chart2: any;
  private element: any;

  ngAfterViewInit() {
    this.chart1 = c3.generate({
      // bindto: this.element,
      bindto: document.getElementById('chart_entradas'),
      size: {
        height: 400
      },
      data: {
        type: 'donut',
        columns: [[]],
      },
      donut: {
        title: "Entradas"
      }
    });
    this.chart2 = c3.generate({
      // bindto: this.element,
      bindto: document.getElementById('chart_saidas'),
      size: {
        height: 400
      },
      data: {
        type: 'donut',
        columns: [[]],
      },
      donut: {
        title: "Saidas"
      }
    });
  }

  updateChart() {
    this.entryService.resumeByDateCategory(this._selectedDate).subscribe((data: Array<any>) => {

      let entradas = Array<Array<string>>();
      let saidas = Array<Array<string>>();
      var anterior: any = false;
      for (let item of data) {
        if(item.value.entrada != 0)
          entradas.push([item._id.category.name, item.value.entrada]);
        if(item.value.saida != 0)
          saidas.push([item._id.category.name, item.value.saida * -1]);
      }

      console.log('entradas:',entradas);
      this.chart1 = c3.generate({
        bindto: document.getElementById('chart_entradas'),
        data: {
          type: 'donut',
          columns: entradas,
          onclick: (element, d) => {
            // this.selectedDate = element.x;

          }
        },
        donut: {
          title: "Entradas"
        },
        size: {
          height: 400
        },
        tooltip: {
          format: {
            value: function (value: number, ratio, id, index) {
              return ' R$: ' + value.toFixed(2);
            }
          }
        },
      })
      this.chart2 = c3.generate({
        bindto: document.getElementById('chart_saidas'),
        data: {
          type: 'donut',
          columns: saidas,
          onclick: (element, d) => {
            // this.selectedDate = element.x;

          }
        },
        donut: {
          title: "Saidas"
        },
        size: {
          height: 400
        },
        tooltip: {
          format: {
            value: function (value: number, ratio, id, index) {
              return ' R$: ' + value.toFixed(2);
            }
          }
        },
      })
    })

  }

  constructor(myElement: ElementRef, public entryService: EntryService) {
    this.element = myElement.nativeElement;
  };

}
