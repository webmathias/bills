import {Component, Input} from '@angular/core';
/**
 * Created by mathias on 11/12/17.
 */

@Component({
  selector: 'Dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class Dashboard {
  public title="";
  private months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  private _selectedDate: String;
  @Input()
  get selectedDate() {
    return this._selectedDate;
  }

  set selectedDate(nvalue) {
    this._selectedDate = nvalue;
    var d = new Date(this._selectedDate+'');
    if(d)
      this.title = this.months[d.getMonth()] + ' de '+ d.getFullYear();
  }

}
