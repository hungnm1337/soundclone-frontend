import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService} from '../../../Services/Admin/account.service';
import { ConfirmDialogComponent } from '../../common.component/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AccountListDTO, RoleDTO, AccountDTO, ChangeRoleDTO } from '../../../interfaces/account.interface';
@Component({
  selector: 'app-account-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './account-manage.component.html',
  styleUrl: './account-manage.component.scss'
})
export class AccountManageComponent implements OnInit {
  accounts: AccountListDTO[] = [];
  filteredAccounts: AccountListDTO[] = [];
  allAccounts: AccountListDTO[] = []; // Store original accounts
  roles: RoleDTO[] = [];
  selectedAccount: AccountDTO | null = null;
  searchQuery: string = '';

  // Filter states
  selectedRoleFilter: string = 'all';
  selectedStatusFilter: string = 'all';

  // Dialog states
  showBlockDialog: boolean = false;
  showRoleDialog: boolean = false;
  showAccountDetail: boolean = false;

  // Selected items for actions
  selectedAccountForAction: AccountListDTO | null = null;
  selectedRoleId: number = 0;

  // Loading states
  isLoading: boolean = false;
  isLoadingDetail: boolean = false;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadAccounts();
    this.loadRoles();
  }


  loadAccounts() {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe(
      (data: AccountListDTO[]) => {
        this.allAccounts = data;
        this.accounts = data;
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error('Failed to load accounts');
      }
    );
  }

  loadRoles() {
    this.accountService.getAllRoles().subscribe(
      (data: RoleDTO[]) => {
        this.roles = data;
      },
      (error) => {
        this.toastr.error('Failed to load roles');
      }
    );
  }

  onSearchInput() {
    // Only apply local filtering when typing, don't call API
    if (this.searchQuery.trim() === '') {
      // Reset to all accounts when search is cleared
      this.accounts = [...this.allAccounts];
      this.filteredAccounts = [...this.allAccounts];
      this.applyFilters();
    }
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      // Reset to all accounts when search is cleared
      this.accounts = [...this.allAccounts];
      this.filteredAccounts = [...this.allAccounts];
      this.applyFilters();
      this.toastr.info('Search cleared');
    } else {
      // Use API search for better results
      this.accountService.searchAccounts(this.searchQuery).subscribe({
        next: (data: AccountListDTO[]) => {
          // Update accounts with search results
          this.accounts = data;
          // Apply additional filters (role, status) on search results
          this.applyFilters();
          this.toastr.success(`Found ${data.length} account(s)`);
        },
        error: (error) => {
          // Fallback to local filtering
          this.accounts = [...this.allAccounts];
          this.applyFilters();
          this.toastr.error('Search failed, showing all accounts');
        }
      });
    }
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.accounts];

    // Note: Search filter is already applied via API, so we don't need to apply it again here
    // The accounts array already contains the search results

    // Apply role filter
    if (this.selectedRoleFilter !== 'all') {
      filtered = filtered.filter(account => account.roleName === this.selectedRoleFilter);
    }

    // Apply status filter
    if (this.selectedStatusFilter !== 'all') {
      filtered = filtered.filter(account => account.status.toLowerCase() === this.selectedStatusFilter.toLowerCase());
    }

    this.filteredAccounts = filtered;
  }

  getUniqueRoles(): string[] {
    const roleNames = this.allAccounts.map(account => account.roleName);
    return [...new Set(roleNames)].sort();
  }

  getUniqueStatuses(): string[] {
    const statuses = this.allAccounts.map(account => account.status);
    return [...new Set(statuses)].sort();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedRoleFilter = 'all';
    this.selectedStatusFilter = 'all';
    this.accounts = [...this.allAccounts]; // Reset to all accounts
    this.filteredAccounts = [...this.allAccounts]; // Reset filtered accounts
  }

  onAccountClick(account: AccountListDTO) {
    this.isLoadingDetail = true;
    this.accountService.getAccountById(account.userId).subscribe(
      (data: AccountDTO) => {
        this.selectedAccount = data;
        this.showAccountDetail = true;
        this.isLoadingDetail = false;
      },
      (error) => {
        this.isLoadingDetail = false;
        this.toastr.error('Failed to load account details');
      }
    );
  }

  onBlockAccount(account: AccountListDTO) {
    this.selectedAccountForAction = account;
    this.showBlockDialog = true;
  }

  onRoleChange(account: AccountListDTO) {
    this.selectedAccountForAction = account;
    // Find the roleId based on roleName
    const currentRole = this.roles.find(role => role.roleName === account.roleName);
    this.selectedRoleId = currentRole ? currentRole.roleId : 0;
    this.showRoleDialog = true;
  }

  confirmBlock() {
    if (this.selectedAccountForAction) {
      const isBlocked = this.selectedAccountForAction.status?.toLowerCase() === 'blocked';
      const action = isBlocked ? this.accountService.unblockAccount : this.accountService.blockAccount;
      const actionText = isBlocked ? 'unblocked' : 'blocked';

      action.call(this.accountService, this.selectedAccountForAction.userId).subscribe(
        (success) => {
          if (success) {
            this.loadAccounts();
            this.closeDialogs();
            this.toastr.success(`Account ${actionText} successfully`);
          } else {
            this.toastr.error(`Failed to ${actionText} account`);
          }
        },
        (error) => {
          this.toastr.error(`Failed to ${actionText} account`);
        }
      );
    }
  }

  confirmRoleChange() {
    if (this.selectedAccountForAction && this.selectedRoleId > 0) {
      // Find current roleId based on roleName
      const currentRole = this.roles.find(role => role.roleName === this.selectedAccountForAction?.roleName);
      const currentRoleId = currentRole ? currentRole.roleId : 0;

      if (this.selectedRoleId !== currentRoleId) {
        const changeRoleData: ChangeRoleDTO = {
          userId: this.selectedAccountForAction.userId,
          roleId: this.selectedRoleId
        };

        // Find new role name for display
        const newRole = this.roles.find(role => role.roleId === this.selectedRoleId);
        const newRoleName = newRole ? newRole.roleName : 'Unknown';

        this.accountService.changeUserRole(changeRoleData).subscribe(
          (success) => {
            if (success) {
              this.loadAccounts();
              this.closeDialogs();
              this.toastr.success(`Role changed to ${newRoleName}`);
            } else {
              this.toastr.error('Failed to change role');
            }
          },
          (error) => {
            this.toastr.error('Failed to change role');
          }
        );
      } else {
        this.toastr.warning('Please select a different role');
      }
    }
  }

  isRoleChanged(): boolean {
    if (!this.selectedAccountForAction) return false;

    const currentRole = this.roles.find(role => role.roleName === this.selectedAccountForAction?.roleName);
    const currentRoleId = currentRole ? currentRole.roleId : 0;

    return this.selectedRoleId !== currentRoleId;
  }

  closeDialogs() {
    this.showBlockDialog = false;
    this.showRoleDialog = false;
    this.showAccountDetail = false;
    this.selectedAccountForAction = null;
    this.selectedAccount = null;
    this.selectedRoleId = 0;
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getRoleBadgeClass(roleName: string): string {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  trackByUserId(index: number, account: AccountListDTO): number {
    return account.userId;
  }
}
