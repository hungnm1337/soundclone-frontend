import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MenuComponent } from "../menu/menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeaderComponent, MenuComponent, RouterOutlet],
  templateUrl: './homepage.component.html'
})
export class HomepageComponent {

}
