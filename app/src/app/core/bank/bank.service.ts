import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import {bank} from "./bank.model";

@Injectable()
export class BankService {
    private Url = '/api/bank';
    public loading: boolean = false;

    constructor(private http: Http) {
    }

    save(param: bank) {
        this.loading = true;
        let _url: string = this.Url + (param['_id'] ? '/' + param['_id'] : '');
        return this.http.post(_url, param)
            .map((res: Response) => {
                this.loading = false;
                return res.json() || [];
            })
            .catch((error: Response | any) => this.handleError(error));
    }

    remove(param: bank) {
        this.loading = true;
        let _url: string = this.Url + (param['_id'] ? '/' + param['_id'] : '');
        return this.http.delete(_url)
            .map((res: Response) => {
                this.loading = false;
                return res.json() || [];
            })
            .catch((error: Response | any) => this.handleError(error));
    }

    getBanks(): Observable<bank[]> {
        this.loading = true;
        return this.http.get(this.Url)
            .map((res: Response) => {
                this.loading = false;
                return res.json() || [];
            })
            .catch((error: Response | any) => this.handleError(error));
    }

    get(id: string): Observable<bank> {
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
