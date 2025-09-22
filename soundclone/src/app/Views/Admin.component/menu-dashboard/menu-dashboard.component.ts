import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './menu-dashboard.component.html',
  styleUrl: './menu-dashboard.component.scss'
})
export class MenuDashboardComponent {

constructor(private router: Router) { }
systemAnalysis() {
this.router.navigate(['/dashboard/analysist']);}
serviceManage() {
this.router.navigate(['/dashboard/services']);}
reportManage() {
this.router.navigate(['/dashboard/reports']);}
accountManage() {
this.router.navigate(['/dashboard/accounts']);}
notificationManage() {
this.router.navigate(['/dashboard/notifications']);}
}
