import { Component, Input } from '@angular/core';
import { PageMenu } from "../../models/page-menu";
import { Platform, MenuController } from 'ionic-angular';

@Component({
  selector: 'header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent {

  @Input() dvMenu: PageMenu;

  constructor(public menuCtrl: MenuController) {
    this.menuCtrl.enable(false, 'right');
    console.log('HeaderMenuComponent called');
  }

  ngOnInit(): void {
    console.log( 'HeaderMenuComponent ngOnInit()' + this.dvMenu);
  }

  // called menu item click
  openPage( value: string) {
    console.log('menu item clicked: '+ value);
  }

}
