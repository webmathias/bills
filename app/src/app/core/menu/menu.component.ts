/**
 * Created by mathias on 06/12/16.
 */
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../login/login.service';
import {EntryService} from "../entry/entry.service";
import {resume} from "../resumo/resumo.model";

@Component({
    selector: 'vt-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.css']
})
export class MenuComponent {

    constructor(private router: Router,
                private route: ActivatedRoute,
                private logindService: LoginService,
                public entryService: EntryService) {
        if (this.logindService.isloged()) {
            console.log("ja tem usuario")
        } else {
            console.log("Usuario não logado")
            this.router.navigate([''])

        }
        entryService.updateSaldos()

    };
    logoff(){
        this.logindService.logoff().subscribe(() => {
            this.router.navigate(['/'])
        });

    }

    isActiveMenu(route: string) {
        return this.router.isActive(route, true);
    };



}
