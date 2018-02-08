import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {resume, resumeCat, resumeEntry} from '../resumo/resumo.model';
import {entry} from "./entry.model";


@Injectable()
export class EntryService {
  private Url = '/api/entry';
  public loading: boolean = false;

  public saldos: Array<any>;

  updateSaldos() {
    var mes = new Date().getMonth() + 1;
    this.resumeByBankSaldo(mes).subscribe((data) => {
        // this.resumeByBank = data;
        this.saldos = [];

        data.sort((a: any, b: any) => {
          return b._id.bank.name < a._id.bank.name ? 1 : -1;
        }).map((data) => {
          var tmp: any = null;
          for (var i = 0; i < this.saldos.length; i++) {
            if (this.saldos[i]._id.bank.name == data._id.bank.name) {
              tmp = this.saldos[i];
            }
          }
          if (tmp == null) {
            tmp = {};
            tmp._id = {
              bank: data._id.bank,
              confirmed: true
            }
            tmp.valueNotConfirmed = 0;
            tmp.value = 0;
            this.saldos.push(tmp);
          }
          if (!data._id.confirmed) {
            if (data.value) {
              tmp.valueNotConfirmed = data.value;
            }
          } else {
            if (data.value) {
              tmp.value = data.value;
            }
          }
        });
      }
    );
  }


  constructor(private http: Http) {
  }

  resumeByDate(): Observable<Array<any>> {
    // var date:Date = new Date();
    // date.setMonth(mes-1);
    this.loading = true;
    var _url: string = this.Url + ('/resumeByDate');
    return this.http.get(_url)
      .map((res: Response) => {
        console.log(res);
        this.loading = false;
        return res.json() || [];
      })
    .catch((error: Response | any) => this.handleError(error));
  }
  resumeByDateCategory(date:String): Observable<Array<any>> {
    // var date:Date = new Date();
    // date.setMonth(mes-1);
    this.loading = true;
    var _url: string = this.Url + ('/resumeByDateCategory'+"?date="+date);
    return this.http.get(_url)
      .map((res: Response) => {
        console.log(res);
        this.loading = false;
        return res.json() || [];
      })
    .catch((error: Response | any) => this.handleError(error));
  }
  resumeTable(): Observable<Array<any>> {
    // var date:Date = new Date();
    // date.setMonth(mes-1);
    this.loading = true;
    let _url: string = this.Url + ('/resumeTable?format=table');
    return this.http.post(_url,{
      columns:['date.month', 'date.year'],
      value: 'value',

    })
      .map((res: Response) => {
        console.log(res);
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }
  resumeByBankSaldo(mes: number): Observable<Array<resume>> {
    var date: Date = new Date();
    date.setMonth(mes - 1);
    this.loading = true;
    let _url: string = this.Url + ('/resumeByBank?date=' + date);
    return this.http.get(_url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }
  resumeByBank(mes: number, year: number): Observable<Array<resume>> {
    var date: Date = new Date();
    date.setMonth(mes - 1);
    date.setFullYear(year);
    this.loading = true;
    let _url: string = this.Url + ('/resumeByBankNew?date=' + date);
    return this.http.get(_url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  resumeByCategory(mes: number, bank: string, year: number): Observable<Array<resumeCat>> {
    var date: Date = new Date();
    date.setMonth(mes - 1);
    date.setFullYear(year);
    this.loading = true;
    let _url: string = this.Url + ('/resumeByCategoryNew?bank=' + bank + '&date=' + date);
    return this.http.get(_url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }
  resumeByEntry(mes: number, bank: string, category: string, year: number): Observable<Array<resumeEntry>> {
    // TODO Continuar
    var date: Date = new Date();
    date.setMonth(mes - 1);
    date.setFullYear(year);
    this.loading = true;
    let _url: string = this.Url + ('/resumeByEntry?bank=' + bank + '&date=' + date+'&category='+category);
    return this.http.get(_url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }
  resumeTotalByCategory(mes: number, year: number): Observable<Array<resumeCat>> {
    var date: Date = new Date();
    date.setMonth(mes - 1);
    date.setFullYear(year);
    this.loading = true;
    let _url: string = this.Url + ('/resumeByCategoryNew?date=' + date);
    return this.http.get(_url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  save(param: entry) {
    this.loading = true;
    let _url: string = this.Url + (param['_id'] ? '/' + param['_id'] : '');
    return this.http.post(_url, param)
      .map((res: Response) => {
        this.loading = false;
        this.updateSaldos();
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  remove(param: entry) {
    this.loading = true;
    let _url: string = this.Url + (param['_id'] ? '/' + param['_id'] : '');
    return this.http.delete(_url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  getEntrys(): Observable<entry[]> {
    this.loading = true;
    return this.http.get(this.Url)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  getEntrysNotConfirmed(): Observable<entry[]> {
    this.loading = true;
    return this.http.get(this.Url + '/pendents')
      .map((res: Response) => {
        this.loading = false;
        return res.json() || [];
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  get(id: string): Observable<entry> {
    this.loading = true;
    return this.http.get(this.Url + '/' + id)
      .map((res: Response) => {
        this.loading = false;
        return res.json() || false;
      })
      .catch((error: Response | any) => this.handleError(error));
  }

  private handleError(error: Response | any) {
    this.loading = false;
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
