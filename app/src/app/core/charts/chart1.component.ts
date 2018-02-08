import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {EntryService} from '../../core/entry/entry.service';
import * as c3 from 'c3';
import * as d3 from 'd3';

declare var $: any;
@Component({
  selector: 'chart1',
  template: '',
  styles: ['.c3-lines{fill: none;}'],
  encapsulation: ViewEncapsulation.None
})
export class Chart1 implements AfterViewInit {
  private _selectedDate: String;
  @Input()
  get selectedDate() {
    return this._selectedDate;
  }
  set selectedDate(nvalue) {
    this._selectedDate = nvalue;
    this.selectedDateChange.emit(this._selectedDate);
  }
  @Output() selectedDateChange = new EventEmitter()


  private chart: any;
  private element: any;

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: this.element,
      size: {
        height: 400
      },
      data: {
        x: 'x',
        columns: [
          ['x', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ['Diferença', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ['Entradas', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ['Saidas', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
      },
    });
    this.entryService.resumeByDate().subscribe((data: Array<any>) => {

      let saldos = Array<any>();
      let entradas = Array<any>();
      let saidas = Array<any>();
      let categories = Array<string>();
      let regions = Array<any>();
      var d1 = new Date();
      d1.setDate(1);
      var d2 = new Date();
      d2.setMonth(d2.getMonth() + 1);
      d2.setDate(1);
      this.selectedDate = d1+'';
      regions.push({start: d1, end: d2});
      regions.push( {axis: 'y', start: -30000, end: 0});
      saldos.push('Diferença');
      entradas.push('Entradas');
      saidas.push('Saidas');
      categories.push('x');
      var anterior: any = false;
      for (let item of data) {
        saldos.push(item.value.saldo);
        entradas.push(item.value.entrada);
        saidas.push(item.value.saida*-1);
        categories.push(item._id.data + '-01');
      }

      this.chart = c3.generate({
        bindto: this.element,
        data: {
          x: 'x',
          columns: [
            categories,
            saldos,
            entradas,
            saidas
          ],
          onclick: (element, d) => {
            this.selectedDate = element.x;

          }
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
        regions: regions,
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m'
            }
          }
        }
      })
    })

  }

  constructor(myElement: ElementRef, public entryService: EntryService) {
    this.element = myElement.nativeElement;
  };

}
