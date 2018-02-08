/**
 * Created by mathias on 11/29/17.
 */
import {animate, AnimationBuilder, keyframes, state, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';
declare var $: any;
@Component({
  selector: 'lego',
  templateUrl: 'lego.component.html',
  styleUrls: ['lego.component.css']
})
export class Lego {
  public state = 'inactive'

  constructor(private _builder: AnimationBuilder) {
  }

  public animacao(id) {

    var a = 'translate(' + (Math.random() * 100) + 'px,' + (Math.random() * 100) + 'px)';
    console.log(a)
    const animation = this._builder.build([
        animate(1000, style({
            transform: a
          })
        )
      ])

    ;
    const player = animation.create(document.getElementById(id));
    player.play();
  }

  public anima() {
    console.log('click')
    var objetos = ['Gota-0', 'Group-0', 'rect', 'rect1', 'vec1'];
    objetos.forEach((v) => {
      this.animacao(v)
    })


  }

}
