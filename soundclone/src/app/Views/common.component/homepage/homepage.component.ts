import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { MenuComponent } from "../menu/menu.component";
import { ContentComponent } from "../content/content.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeaderComponent, MenuComponent, ContentComponent],
  templateUrl: './homepage.component.html'
})
export class HomepageComponent {

}
