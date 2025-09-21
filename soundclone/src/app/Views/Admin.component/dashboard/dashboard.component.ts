import { Component } from '@angular/core';
import { HeaderComponent } from "../../common.component/header/header.component";
import { MenuDashboardComponent } from "../menu-dashboard/menu-dashboard.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, MenuDashboardComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
