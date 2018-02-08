import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {Pendencias} from './core/pendencias/pendencias.component';
import {Lancamento} from './core/lancamento/lancamento.component';
import {Dashboard} from './core/dashboard/dashboard.component';
import {Telaresumo} from './core/resumo/resumo.component';
import {UserFormComponent} from './core/user/user-form.component';
import {UserListComponent} from './core/user/user-list.component';
// import {Importar} from './core/importar/importar.component';
import {BankFormComponent} from './core/bank/bank-form.component';
import {BankListComponent} from './core/bank/bank-list.component';
import {EntryFormComponent} from './core/entry/entry-form.component';
import {EntryListComponent} from './core/entry/entry-list.component';
import {CategoryFormComponent} from './core/category/category-form.component';
import {CategoryListComponent} from './core/category/category-list.component';
import {LoginComponent} from './core/login/login.component';
import {MenuComponent} from "./core/menu/menu.component";


// Route Configuration
export const routes: Routes = [
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            {path: 'pendencias', component: Pendencias},
            {path: 'lancamento', component: Lancamento},
            {path: 'user/form', component: UserFormComponent},
            {path: 'user', component: UserListComponent},
            // {path: 'Importar', component: Importar},
            {path: 'bank/form', component: BankFormComponent},
            {path: 'bank', component: BankListComponent},
            {path: 'entry/form', component: EntryFormComponent},
            {path: 'entry', component: EntryListComponent},
            {path: 'category/form', component: CategoryFormComponent},
            {path: 'category', component: CategoryListComponent},
            {path: 'Resumo', component: Telaresumo},
            {path: 'dashboard', component: Dashboard},

        ]
    },
    {path: '', component: LoginComponent},


];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
