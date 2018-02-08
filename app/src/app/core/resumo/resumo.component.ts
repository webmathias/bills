import {Component, Pipe} from '@angular/core';
import {EntryService} from '../entry/entry.service';
import {resume, resumeCat, resumeEntry} from './resumo.model';

@Component({
  selector: 'TelaResumo',
  templateUrl: 'resumo.component.html',
  styleUrls: ['resumo.component.css']
})
export class Telaresumo {
  public selectedDate: String;

  public resume: Array<resume>;
  public total: resume = new resume();
  public npoupanca: resume = new resume();
  public meses: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  public _currentPage: number;
  public _currentYear: number;
  set currentYear(value: number) {
    this._currentYear = value;
    this.updateResumo(this._currentPage);
  }

  get currentYear() {
    return this._currentYear;
  }

  public loading: boolean;
  public currentExpand: resume;
  public currentExpandEntry: resumeCat;
  public resumoPorMes: Array<any> = []

  constructor(public entryService: EntryService) {
    this._currentPage = new Date().getMonth() + 1;
    this._currentYear = new Date().getFullYear();
    this.updateResumo(this._currentPage);
  };


  updateResumoCat(resumo: resume) {
    this.currentExpandEntry = null;
    if (this.currentExpand == resumo) {
      this.currentExpand = null;
      return;
    }

    this.currentExpand = resumo;
    if (resumo.resumeCat) return;
    this.entryService.resumeByCategory(this._currentPage, resumo._id.bank._id, this._currentYear).subscribe((data) => {
        // this.resumeByBank = data;
        // resumo.resumeCat = [];

        resumo.resumeCat = data
          .sort((a: resumeCat, b: resumeCat) => {
            return b._id.category.name < a._id.category.name ? 1 : -1;
          })
      }
    );

  }

  updateResumoEntry(resumo: resume, resumocat: resumeCat) {
    if (this.currentExpandEntry == resumocat) {
      this.currentExpandEntry = null;
      return;
    }

    this.currentExpandEntry = resumocat;
    if (resumocat.resumeEntry) return;
    console.log(resumo, resumocat);
    this.entryService.resumeByEntry(this._currentPage, resumo ? resumo._id.bank._id : '', resumocat._id.category._id, this._currentYear).subscribe((data) => {
        // this.resumeByBank = data;
        // resumo.resumeCat = [];

        resumocat.resumeEntry = data
          .sort((a: resumeEntry, b: resumeEntry) => {
            return b._id.entry.date < a._id.entry.date ? 1 : -1;
          })
      }
    );

  }

  updateResumo(mes: number) {
    this.loading = true;
    this._currentPage = mes;
    this.total = new resume()
    this.npoupanca = new resume()
    this.entryService.resumeByBank(mes, this._currentYear).subscribe((data) => {
        // this.resumeByBank = data;
        this.resume = [];
        console.log(this.total);
        this.total.value.entrada = 0;
        this.total.value.saida = 0;
        this.total.value.entradaConfirmada = 0;
        this.total.value.saidaConfirmada = 0;
        this.npoupanca.value.entrada = 0;
        this.npoupanca.value.saida = 0;
        this.npoupanca.value.entradaConfirmada = 0;
        this.npoupanca.value.saidaConfirmada = 0;
        data
          .sort((a: resume, b: resume) => {
            return b._id.bank.name < a._id.bank.name ? 1 : -1;
          })
          .map((data) => {

            var tmp: resume = new resume();
            tmp._id = data._id
            tmp.value.entrada = data.value.entrada;
            tmp.value.entradaConfirmada = data.value.entradaConfirmada;
            tmp.value.saida = data.value.saida;
            tmp.value.saidaConfirmada = data.value.saidaConfirmada;
            if (this.entryService.saldos) {
              var t = this.entryService.saldos.filter((conta: any) => {
                if (conta._id.bank._id == data._id.bank._id && conta._id.confirmed == true) {
                  return conta;
                }
              });
              if (t.length == 1)
                tmp.value.saldo = t[0].value + t[0]._id.bank.intialvalue;
            }
            if (tmp._id.bank.saveaccount) {
              this.npoupanca.value.entrada += tmp.value.entrada
              this.npoupanca.value.entradaConfirmada += tmp.value.entradaConfirmada
              this.npoupanca.value.saida += tmp.value.saida
              this.npoupanca.value.saidaConfirmada += tmp.value.saidaConfirmada;
              this.npoupanca.value.saldo += tmp.value.saldo;

            } else {
              this.total.value.entrada += tmp.value.entrada
              this.total.value.entradaConfirmada += tmp.value.entradaConfirmada
              this.total.value.saida += tmp.value.saida
              this.total.value.saidaConfirmada += tmp.value.saidaConfirmada;
              this.total.value.saldo += tmp.value.saldo;
            }
            this.resume.push(tmp)

          });
        this.entryService.resumeTotalByCategory(this._currentPage, this._currentYear).subscribe((data) => {
            // this.resumeByBank = data;
            this.total.resumeCat = data
              .sort((a: resumeCat, b: resumeCat) => {
                return b._id.category.name < a._id.category.name ? 1 : -1;
              });
          }
        );

        this.loading = false
      }
    );
  }
}
