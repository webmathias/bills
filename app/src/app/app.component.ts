import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {TranslateService} from 'ng2-translate';
import {animate, AnimationBuilder, style} from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('app') app: ElementRef;

  constructor(private router: Router, private translate: TranslateService, private _builder: AnimationBuilder) {
    translate.setDefaultLang('pt');
    translate.use('pt');
    this.router.events.subscribe(event => {
      console.log('NavigationStart 1 ', event.constructor.name)
      if (event.constructor.name === 'NavigationStart') {
        console.log('NavigationStart 2', event.constructor.name)
        const animation = this._builder.build([
          animate(1000, style({
            opacity: '0'
            })
          )
        ]);
        const player = animation.create(this.app.nativeElement);
        player.play();
      }
    });
  };

  isActiveMenu(route: string) {
    return this.router.isActive(route, true);
  };

}
