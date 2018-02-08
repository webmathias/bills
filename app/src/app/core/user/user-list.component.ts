import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import {User} from "./user.model";


@Component({
    selector: 'user-list',
    templateUrl: 'user-list.component.html',
    styleUrls: ['user.component.css'],
    providers: [UserService]
})
export class UserListComponent {
    lista: Array<User> = [];

    constructor(private userService: UserService, private router: Router) {
        userService.getUsers().subscribe(user => this.lista = user);

    };

    _new() {
        this.router.navigateByUrl('menu/user/form');

    }

    _remove(selecteds: any) {
        console.log(selecteds);
        for (let user of selecteds) {
            this.userService.remove(user).subscribe(() => {
                this.userService.getUsers().subscribe(user => this.lista = user);
            });
        }

    }

    _edit(selected: any) {
        console.log(selected);
        this.router.navigate(['menu/user/form', {id: selected._id}]);
    }
}
