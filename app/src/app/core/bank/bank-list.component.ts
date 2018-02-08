import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BankService} from './bank.service';
import {bank} from "./bank.model";


@Component({
    selector: 'bank-list',
    templateUrl: 'bank-list.component.html',
    styleUrls: ['bank.component.css'],
    providers: [BankService]
})
export class BankListComponent {

    
    lista: Array<bank> = [];

    constructor(private bankService: BankService, private router: Router) {
        bankService.getBanks().subscribe(bank => this.lista = bank);

    };

    _new() {
        this.router.navigateByUrl('menu/bank/form');

    }

    _remove(selecteds: any) {
        console.log(selecteds);
        for (let bank of selecteds) {
            this.bankService.remove(bank).subscribe(() => {
                this.bankService.getBanks().subscribe(bank => this.lista = bank);
            });
        }

    }

    _edit(selected: any) {
        console.log(selected);
        this.router.navigate(['menu/bank/form', {id: selected._id}]);
    }
}
