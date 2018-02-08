import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CategoryService} from './category.service';
import {category} from "./category.model";


@Component({
    selector: 'category-list',
    templateUrl: 'category-list.component.html',
    styleUrls: ['category.component.css'],
    providers: [CategoryService]
})
export class CategoryListComponent {
    public lista: Array<category> = [];

    constructor(public categoryService: CategoryService, private router: Router) {
        categoryService.getCategorys().subscribe(category => this.lista = category);

    };

    _new() {
        this.router.navigateByUrl('menu/category/form');

    }

    _remove(selecteds: any) {
        console.log(selecteds);
        for (let category of selecteds) {
            this.categoryService.remove(category).subscribe(() => {
                this.categoryService.getCategorys().subscribe(category => this.lista = category);
            });
        }

    }

    _edit(selected: any) {
        console.log(selected);
        this.router.navigate(['menu/category/form', {id: selected._id}]);
    }
}
