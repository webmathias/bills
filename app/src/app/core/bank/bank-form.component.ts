import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BankService} from './bank.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {bank} from "./bank.model";



@Component({
    selector: 'bank-form',
    templateUrl: 'bank-form.component.html',
    styleUrls: ['bank.component.css'],
    providers: [BankService]
})
export class BankFormComponent {
    public model: bank;
    form: FormGroup;


    constructor(public bankService: BankService,
                private router: Router,
                private route: ActivatedRoute) {
        this.model = new bank();
        this.form = new FormBuilder().group({});
        if (this.route.params['value']['id']) {
            this.bankService.get(this.route.params['value']['id']).subscribe(_ => this.model = _);
        }
        console.log()

    };

    save(model: any) {
        this.bankService.save(model).subscribe(aa => {
            console.log(aa)
            this.router.navigateByUrl('menu/bank');
        });
    }
}
