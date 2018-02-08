import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from './user.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {User} from "./user.model";

@Component({
    selector: 'user-form',
    templateUrl: 'user-form.component.html',
    styleUrls: ['user.component.css'],
    providers: [UserService]
})
export class UserFormComponent {
    model: User;
    form: FormGroup;


    constructor(public userService: UserService,
                private router: Router,
                private route: ActivatedRoute) {
        this.model = new User();
        this.form = new FormBuilder().group({});
        if (this.route.params['value']['id']) {
            this.userService.get(this.route.params['value']['id']).subscribe(_ => this.model = _);
        }
        console.log()

    };

    save(model: any) {
        this.userService.save(model).subscribe(aa => {
            console.log(aa)
            this.router.navigateByUrl('menu/user');
        });
    }
}
