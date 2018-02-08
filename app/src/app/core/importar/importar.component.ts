// import {Component, Input} from '@angular/core';
// import {BankService} from "../../core/bank/bank.service";
// import {FileUploader, FileItem} from 'ng2-file-upload';
// import {EntryService} from "../../core/entry/entry.service";
// import {CategoryService} from "../../core/category/category.service";
// import {bank} from "../bank/bank.model";
// import {entry} from "../entry/entry.model";
// import {category} from "../category/category.model";
// declare var $:any;
// @Component({
//     selector: 'Importar',
//     templateUrl: 'importar.component.html',
//     styleUrls: ['importar.component.css']
// })
// export class Importar {
//     private _json: any = '[]';
//     private _resumo: any = {};
//     private progresso: Number = 0;
//     private salvando: Number = 0;
//     public progressentry:number;
//     public progressentrytotal:number;
//     @Input()
//     dataPercent: any;
//
//     public uploader: FileUploader = new FileUploader({url: '/api/import'});
//     public hasBaseDropZoneOver: boolean = false;
//
//     constructor(private bankService: BankService, private categoryService: CategoryService, private entryService: EntryService) {
//         this.uploader.onSuccessItem = (file, response) => {
//             this.finish(file, response);
//         };
//     };
//
//
//     private finish(file: FileItem, response: string) {
//         //console.log(response);
//         this.json = response;
//         this.process();
//     }
//
//     set json(data:any) {
//         this._json = data;
//
//     }
//
//     get resumo() {
//         return JSON.stringify(this._resumo, null, 4);
//     }
//
//     public fileOverBase(e: any): void {
//         this.hasBaseDropZoneOver = e;
//         console.log(e);
//         this.uploader.uploadAll();
//     }
//
//
//     private banks: Array<bank> = new Array();
//     private entries: Array<entry> = new Array();
//     private categories: Array<category> = new Array();
//
//     process() {
//         this.uploader.uploadAll();
//         this._resumo = {
//             total: 0
//         };
//         var _json = JSON.parse(this._json);
//
//         _json.forEach((i:any, k:number) => {
//             i.conta = i.conta;
//             this.progresso = (k / _json.length) * 100;
//             if (!this._resumo[i.conta.nome])
//                 this._resumo[i.conta.nome] = {
//                     total: 0,
//                     previsto: 0,
//                     Entrada: 0,
//                     Saida: 0,
//                     Registros: 0
//                 };
//             this._resumo[i.conta.nome][i.tipo] += i.valor;
//             var temconta = false;
//             var indexconta = 0;
//             // console.log(i.conta);
//             for (let j = 0; j < this.banks.length; j++) {
//                 // if(j==0)
//                 //  console.log(this.banks[j].name + " == "+ i.conta.nome +" -> "+(this.banks[j].name == i.conta.nome));
//                 if (this.banks[j].name == i.conta.nome) {
//
//                     temconta = true;
//                     indexconta = j;
//                     break;
//                 }
//             }
//
//             if (!temconta) {
//                 //    constructor(name = "", number = 0, bank = 0, account = 0, intialvalue = 0, data =new Date(), active = true, saveaccount = false) {
//                 console.log(i.conta);
//                 this.banks.push(new bank(i.conta.nome, i.conta.agencia, i.conta.banco, 0, i.conta.saldoInicial,i.conta.dataSaldo, i.conta.ativo, i.conta.poupanca));
//                 indexconta = this.banks.length-1;
//
//             }
//             var temcategoria = false;
//             var indexcategoria = 0;
//             i.categoria = !i.categoria ? 'Outros' : i.categoria;
//             for (let j = 0; j < this.categories.length; j++) {
//                 if (this.categories[j].name == i.categoria) {
//                     temcategoria = true;
//                     indexcategoria = j;
//                 }
//             }
//             if (!temcategoria) {
//                 console.log("Categoria:", i.categoria);
//                 this.categories.push(new category(i.categoria));
//                 indexcategoria = this.categories.length - 1;
//             }
//             //description="",category="",bank="",value=0,date=Date.now,confirmed=false
//             this.entries.push(
//                 new entry(
//                     i.descricao,
//                     this.categories[indexcategoria].name,
//                     this.banks[indexconta].name,
//                     i.tipo == 'Entrada' ? i.valor : (i.valor*-1),
//                     i.data,
//                     i.calculado
//                 ))
//             if (i.calculado)
//                 this._resumo[i.conta.nome].total += i.tipo == 'Entrada' ? i.valor : i.valor*-1;
//             else
//                 this._resumo[i.conta.nome].previsto += i.tipo == 'Entrada' ? i.valor : i.valor*-1;
//
//             this._resumo[i.conta.nome].Registros++;
//         });
//         this._resumo.contassize = this.banks.length
//     }
//
//     salvarBank() {
//         var progressbank = 0;
//         this.banks.forEach((value, key) => {
//             this.bankService.save(value)
//                 .subscribe((data) => {
//                     progressbank++;
//                     this.banks[key] = data;
//                     $('#progresbank').progress({
//                         percent: (progressbank / this.banks.length * 100).toFixed(0)
//                     });
//
//                 });
//         });
//     }
//
//     salvarCategory() {
//
//         var progresscategories = 0;
//         this.categories.forEach((value, key) => {
//             this.categoryService.save(value).subscribe((data) => {
//                 progresscategories++;
//                 this.categories[key] = data;
//                 $('#progrescategory').progress({
//                     percent: (progresscategories / this.categories.length * 100).toFixed(0)
//                 });
//             });
//         });
//     }
//
//     salvarEntry() {
//
//         this.progressentry = 0;
//         this.progressentrytotal = this.entries.length;
//         this._salvarOneEntry();
//     }
//
//     _salvarOneEntry() {
//         if(!this.entries.length) return;
//         var value: entry = this.entries.pop();
//         for (let j = 0; j < this.categories.length; j++) {
//             if (this.categories[j].name == value.category) {
//                 value.category = this.categories[j]._id;
//             }
//         }
//         for (let j = 0; j < this.banks.length; j++) {
//             if (this.banks[j].name == value.bank) {
//                 value.bank = this.banks[j]._id;
//             }
//         }
//         this.entryService.save(value).subscribe(() => {
//             this.progressentry++;
//             $('#progresentry').progress({
//                 percent: (this.progressentry / this.progressentrytotal * 100).toFixed(0)
//             });
//             this._salvarOneEntry();
//         })
//
//     }
//
//
// }
