import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CategoryService} from '../../core/category/category.service';
import {BankService} from '../../core/bank/bank.service';
import {EntryService} from '../../core/entry/entry.service';
import {category} from '../category/category.model';
import {bank} from '../bank/bank.model';
import {entry} from '../entry/entry.model';

@Component({
  selector: 'pendencias',
  templateUrl: 'pendencias.component.html',
  styleUrls: ['pendencias.component.css']
})
export class Pendencias {
  public categories: Array<category> = [];
  public banks: Array<bank> = [];
  public pendencias: Array<entry> = [];
  public pendenciasEntradas: Array<entry> = [];
  public pendenciasSaidas: Array<entry> = [];
  public pendenciasCredito: Array<entry> = [];
  public currenttab: Number = 0;

  constructor(private entryService: EntryService, private categoriyService: CategoryService, private bankService: BankService) {
    categoriyService.getCategorys().subscribe(data => this.categories = data);
    bankService.getBanks().subscribe(data => this.banks = data);
    entryService.getEntrysNotConfirmed().subscribe(data => {
      this.pendencias = [];
      this.pendenciasCredito = [];
      this.pendenciasEntradas = [];
      this.pendenciasSaidas = [];
      var ummes = new Date();
      ummes.setMonth(ummes.getMonth() + 1);
      data.forEach((item) => {
        if (item.credito) {
          this.pendenciasCredito.push(item);
        } else {

          if (new Date(item.date).getTime() < ummes.getTime()) {
            if (item.value < 0) {
              this.pendenciasSaidas.push(item);
            } else {
              this.pendenciasEntradas.push(item);
            }
          } else {
            this.pendencias.push(item)
          }
        }
      })

    });
  };

  getBankName(item: string) {
    let bank = (this.banks.filter(i => {
      if (i._id == item) return i.name;
    }));
    if (bank.length == 1) {
      return bank[0].name;
    }
  }

  getCategoryName(item: string) {
    let cat = (this.categories.filter(i => {
      if (i._id == item) return i.name;
    }));
    if (cat.length == 1)
      return cat[0].name;
  }

  confirmar(entry: entry) {
    entry.confirmed = true;
    this.entryService.save(entry).subscribe((data) => {
      this.pendencias.splice(this.pendencias.indexOf(entry), 1);
    });
  }

  confirmarCredito(entry: entry) {
    entry.confirmed = true;
    this.entryService.save(entry).subscribe((data) => {
      this.pendenciasCredito.splice(this.pendenciasCredito.indexOf(entry), 1);
    });
  }

  confirmarEntrada(entry: entry) {
    entry.confirmed = true;
    this.entryService.save(entry).subscribe((data) => {
      this.pendenciasEntradas.splice(this.pendenciasEntradas.indexOf(entry), 1);
    });
  }

  confirmarSaida(entry: entry) {
    entry.confirmed = true;
    this.entryService.save(entry).subscribe((data) => {
      this.pendenciasSaidas.splice(this.pendenciasSaidas.indexOf(entry), 1);
    });
  }

}
