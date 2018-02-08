import {category} from "../category/category.model";
import {bank} from "../bank/bank.model";
import {entry} from '../entry/entry.model';
export class resumeEntry {
  constructor(){
    this.value = {
      entrada: 0,
      saida: 0,
      entradaConfirmada: 0,
      saidaConfirmada: 0,
    }
  }
  public _id: {
    entry: entry,
    confirmed: boolean
  };
  public value: {
    entrada: number;
    saida: number;
    entradaConfirmada: number;
    saidaConfirmada: number;
  }
}
export class resumeCat {
  constructor(){
    this.value = {
      entrada: 0,
      saida: 0,
      entradaConfirmada: 0,
      saidaConfirmada: 0,
    }
  }
  public _id: {
    category: category,
    confirmed: boolean
  };
  public value: {
    entrada: number;
    saida: number;
    entradaConfirmada: number;
    saidaConfirmada: number;
  }
  public resumeEntry: Array<resumeEntry>;
}
export class resume {
  constructor(){
   this.value = {
     entrada: 0,
     saida: 0,
     entradaConfirmada: 0,
     saidaConfirmada: 0,
     saldo:0
   }
  }
  public _id: {
    bank: bank,
    confirmed: boolean
  };
  public value: {
     entrada: number;
     saida: number;
     entradaConfirmada: number;
     saidaConfirmada: number;
     saldo:number
  }
  public resumeCat: Array<resumeCat>;
}
