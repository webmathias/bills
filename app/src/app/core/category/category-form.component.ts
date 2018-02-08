import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CategoryService} from './category.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {category} from "./category.model";


@Component({
    selector: 'category-form',
    templateUrl: 'category-form.component.html',
    styleUrls: ['category.component.css'],
    providers: [CategoryService]
})
export class CategoryFormComponent {
    model: category;
    form: FormGroup;


    constructor(public categoryService: CategoryService,
                private router: Router,
                private route: ActivatedRoute) {
        this.model = new category();
        this.form = new FormBuilder().group({});
        if (this.route.params['value']['id']) {
            this.categoryService.get(this.route.params['value']['id']).subscribe(_ => this.model = _);
        }
        console.log()

    };

    save(model: any) {
        this.categoryService.save(model).subscribe(aa => {
            console.log(aa)
            this.router.navigateByUrl('menu/category');
        });
    }
}
