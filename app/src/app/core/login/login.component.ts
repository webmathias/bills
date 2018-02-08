/**
 * Created by mathias on 06/12/16.
 */
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginService, Login} from './login.service'
import {animate, style, transition, trigger} from '@angular/animations';

declare var $: any;

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  animations: [
    trigger('entrada', [
      transition(':enter', [
        style({opacity: 0}),
        animate(1500, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(1500, style({opacity: 0}))
      ])
    ])
  ]
})
export class LoginComponent {
  public user: Login = new Login('', '');
  public message: string = '';

  constructor(public  loginservice: LoginService, private router: Router) {
    this.loginservice.checkLogin().subscribe(
      (user) => this.router.navigate(['menu/Resumo']),
      (err) => {
      }
    )

  };

  ngOnInit() {
    console.log('ngOnInit');
  }

  save() {
    console.log('aaaaa')
  }

  _signup() {
    $('.ui.modal')
      .modal('show')
    ;
  }

  _login(data: Login) {
    this.message = '';
    this.loginservice.login(data)
      .subscribe(
        (user) => this.router.navigate(['menu/Resumo']),
        (err) => this.message = err.status == 403 ? 'Usuário ou senha invalido' : err.message
      )
  }
}
