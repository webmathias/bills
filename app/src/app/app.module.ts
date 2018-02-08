import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {HttpModule, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';

import {Pendencias} from './core/pendencias/pendencias.component';
import {Lancamento} from './core/lancamento/lancamento.component';
import {Telaresumo} from './core/resumo/resumo.component';
import {UserService} from './core/user/user.service';
import {UserListComponent} from './core/user/user-list.component';
import {UserFormComponent} from './core/user/user-form.component';
// import {Importar} from './core/importar/importar.component';
import {BankService} from './core/bank/bank.service';
import {BankListComponent} from './core/bank/bank-list.component';
import {BankFormComponent} from './core/bank/bank-form.component';
import {EntryService} from './core/entry/entry.service';
import {EntryListComponent} from './core/entry/entry-list.component';
import {EntryFormComponent} from './core/entry/entry-form.component';
import {routing} from './app.routes';
import {CategoryService} from './core/category/category.service';
import {VTComponentsModule} from './vtComponents/vt.components.module';
import {CategoryFormComponent} from './core/category/category-form.component';
import {CategoryListComponent} from './core/category/category-list.component';



import {LoginComponent} from './core/login/login.component';
import {MenuComponent} from './core/menu/menu.component';
import {LoginService} from './core/login/login.service';
import {AppComponent} from './app.component';

import {enableProdMode} from '@angular/core';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import {Chart1} from './core/charts/chart1.component';
import {Chart2} from './core/charts/chart2.component';
import {DinamicTable} from './core/dinamictable/dinamictable.component';
import {ChartResumoCategoria} from './core/charts/chartResumoCategoria.component';
import {Dashboard} from './core/dashboard/dashboard.component';

import {Lego} from './core/lego/lego.component';
import {NgDatepickerModule} from 'ng2-datepicker';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    // NgDatepickerModule,
    Pendencias,
    Lancamento,
    Telaresumo,
    UserListComponent, UserFormComponent,
    // Importar,
    BankListComponent, BankFormComponent,
    EntryListComponent, EntryFormComponent,
    CategoryListComponent, CategoryFormComponent,
    MenuComponent,
    LoginComponent,
    Chart1,
    Chart2,
    Dashboard,
    ChartResumoCategoria,
    DinamicTable,
    Lego
  ],
  imports: [
    routing,
    VTComponentsModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    BrowserAnimationsModule
  ],
  providers: [
    UserService,
    BankService,
    EntryService,
    CategoryService,
    LoginService,

  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
