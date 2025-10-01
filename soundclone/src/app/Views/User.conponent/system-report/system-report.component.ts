import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService} from '../../../Services/Report/report.service';
import { AuthService } from '../../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SystemReportDetailDTO, SystemReportDTO } from '../../../interfaces/report.interface';

@Component({
  selector: 'app-system-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-report.component.html'
})
export class SystemReportComponent implements OnInit {

  userReports: SystemReportDTO[] = [];
  detailedReport: SystemReportDetailDTO | null = null;
  selectedReportId: number | null = null;
  showCreateModal = false;
  newReportContent = '';
  isLoading = false;

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUserReports();
  }

  loadUserReports(): void {
    this.isLoading = true;
    this.reportService.GetSystemReportByUserId(this.authService.getCurrentUserUserId() || 0).subscribe({
      next: (reports) => {
        this.userReports = reports;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.toastr.error('Unable to load reports list');
        this.isLoading = false;
      }
    });
  }

  viewReportDetails(reportId: number): void {
    this.selectedReportId = reportId;
    this.isLoading = true;
    this.reportService.GetSystemReportById(reportId).subscribe({
      next: (details) => {
        this.detailedReport = details;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading report details:', error);
        this.toastr.error('Unable to load report details');
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newReportContent = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newReportContent = '';
  }

  createReport(): void {
    if (!this.newReportContent.trim()) {
      this.toastr.warning('Please enter report content');
      return;
    }

    const newReport: SystemReportDTO = {
      systemReportId: 0,
      userId: this.authService.getCurrentUserUserId() || 0,
      content: this.newReportContent.trim(),
      isReplied: false
    };

    this.isLoading = true;
    this.reportService.CreateSystemReport(newReport).subscribe({
      next: (success) => {
        if (success) {
          this.toastr.success('Report created successfully');
          this.closeCreateModal();
          this.loadUserReports();
        } else {
          this.toastr.error('Unable to create report');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating report:', error);
        this.toastr.error('Unable to create report');
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(isReplied: boolean): string {
    return isReplied ? 'status-replied' : 'status-pending';
  }

  getStatusText(isReplied: boolean): string {
    return isReplied ? 'Replied' : 'Pending';
  }

  trackByReportId(index: number, report: SystemReportDTO): number {
    return report.systemReportId;
  }
}

