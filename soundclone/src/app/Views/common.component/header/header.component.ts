import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { Subscription } from 'rxjs';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string = '';
  isLoggedIn: boolean = false;
  isMobileMenuOpen: boolean = false;
  isUserDropdownOpen: boolean = false;
  isNotificationDropdownOpen: boolean = false;
  private loginSubscription?: Subscription;

  // Sample notification data
  notifications: Notification[] = [
    {
      id: 1,
      title: 'New Album Released',
      message: 'Taylor Swift has released a new album "Midnights"',
      time: '2 hours ago',
      isRead: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Playlist Updated',
      message: 'Your playlist "Favorites" has been updated with 5 new songs',
      time: '1 day ago',
      isRead: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM',
      time: '2 days ago',
      isRead: true,
      type: 'warning'
    },
    {
      id: 4,
      title: 'Welcome to SoundClone',
      message: 'Thank you for joining our music community!',
      time: '1 week ago',
      isRead: true,
      type: 'success'
    }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close dropdowns if clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.isUserDropdownOpen = false;
    }
    if (!target.closest('.notification-dropdown')) {
      this.isNotificationDropdownOpen = false;
    }
  }

  ngOnInit() {
    this.checkLoginStatus();

    // Subscribe to login state changes
    this.loginSubscription = this.authService.loginState$.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getCurrentUserName() || '';
      console.log('User is logged in:', this.userName);
    } else {
      this.userName = '';
      console.log('User is not logged in');
    }
  }

  // Method to refresh header - can be called from other components
  refreshHeader() {
    this.checkLoginStatus();
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    // Close notification dropdown when opening user dropdown
    if (this.isUserDropdownOpen) {
      this.isNotificationDropdownOpen = false;
    }
  }

  toggleNotificationDropdown() {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    // Close user dropdown when opening notification dropdown
    if (this.isNotificationDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  closeUserDropdown() {
    this.isUserDropdownOpen = false;
  }

  closeNotificationDropdown() {
    this.isNotificationDropdownOpen = false;
  }

  markNotificationAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  getUnreadNotificationCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  }

  showSettings() {
    console.log('Settings clicked');
    // Navigate to settings page or open settings modal
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.isUserDropdownOpen = false;
    this.isNotificationDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
