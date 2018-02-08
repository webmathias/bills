import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
export class Login {
    constructor(public user: string, public password: string) {
    };
}

@Injectable()
export class LoginService {
    private logedUser: string = '';
    private Url = '/api/login';
  public  loading: boolean = false;

    constructor(private http: Http) {
    }
    logoff(){
        return this.http.get('/api/logoff')
            .map((res: Response) => {
                this.loading = false;
                return '';
            })
    }
    isloged() {
        return this.logedUser ? true : false;
    };
    checkLogin(){
        this.loading = true;
        return this.http.get('/api/logincheck')
            .map((res: Response) => {
            this.loading = false;
            return res.json() || [];
        })
            .first(
                (user) => this.logedUser = user

            )
            .catch((err: any) => this.handleError(err));
    }
    login(param: Login) {
        this.loading = true;
        let _url: string = this.Url;

        return this.http.post(_url, param,{withCredentials: true})
            .map((res: Response) => {
                console.log(res);
                this.loading = false;
                return res.json() || [];
            })
            .first(
                (user) => this.logedUser = user

            )
           .catch((err: any) => this.handleError(err));
    }

    private handleError(error: Response | any) {
        this.loading = false;
        let err: {};
        if (error instanceof Response) {
            const body = error || '';
            const errvalue = body || JSON.stringify(body);
            err = {status:error.status,message:`${error.status} - ${error.statusText || ''} ${errvalue}`};
        } else {
            err = {status:error.status,message:error.message ? error.message : error.toString()};
        }
        return Observable.throw(err);
    }
}
