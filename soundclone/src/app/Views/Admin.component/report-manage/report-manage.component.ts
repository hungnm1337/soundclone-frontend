import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService} from '../../../Services/Report/report.service';
import { ReplySystemReportDTO, SystemReportDetailDTO, SystemReportDTO } from '../../../interfaces/report.interface';

@Component({
  selector: 'app-report-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-manage.component.html',
  styleUrl: './report-manage.component.scss'
})
export class ReportManageComponent implements OnInit {
  allReports: SystemReportDTO[] = [];
  filteredReports: SystemReportDTO[] = [];
  selectedReport: SystemReportDetailDTO | null = null;
  selectedReportId: number | null = null;
  loading = true;
  error: string | null = null;
  replyContent = '';
  isSubmittingReply = false;

  // Filter options
  filterStatus: 'all' | 'replied' | 'pending' = 'all';

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.fetchAllReports();
  }

  fetchAllReports() {
    this.loading = true;
    this.error = null;
    this.reportService.GetAllSystemReports().subscribe({
      next: (reports) => {
        this.allReports = reports;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reports';
        this.loading = false;
        console.error('Error loading reports:', err);
      }
    });
  }

  applyFilter() {
    switch (this.filterStatus) {
      case 'replied':
        this.filteredReports = this.allReports.filter(report => report.isReplied);
        break;
      case 'pending':
        this.filteredReports = this.allReports.filter(report => !report.isReplied);
        break;
      default:
        this.filteredReports = [...this.allReports];
    }
  }

  onFilterChange() {
    this.applyFilter();
  }

  selectReport(reportId: number) {
    this.selectedReportId = reportId;
    this.replyContent = '';
    this.error = null;

    this.reportService.GetSystemReportById(reportId).subscribe({
      next: (reportDetail) => {
        this.selectedReport = reportDetail;
      },
      error: (err) => {
        this.error = 'Failed to load report details';
        console.error('Error loading report details:', err);
      }
    });
  }

  submitReply() {
    if (!this.selectedReportId || !this.replyContent.trim()) {
      this.error = 'Please enter a reply';
      return;
    }

    this.isSubmittingReply = true;
    this.error = null;

    const replyData: ReplySystemReportDTO = {
      systemReportId: this.selectedReportId,
      replyContent: this.replyContent.trim()
    };

    this.reportService.ReplySystemReport(replyData).subscribe({
      next: (success) => {
        if (success) {
          this.replyContent = '';
          this.fetchAllReports(); // Refresh the list
          if (this.selectedReport) {
            this.selectedReport.replyContent = replyData.replyContent;
            this.selectedReport.replyDate = new Date().toISOString();
          }
        } else {
          this.error = 'Failed to submit reply';
        }
        this.isSubmittingReply = false;
      },
      error: (err) => {
        this.error = 'Failed to submit reply';
        this.isSubmittingReply = false;
        console.error('Error submitting reply:', err);
      }
    });
  }

  closeReportDetail() {
    this.selectedReport = null;
    this.selectedReportId = null;
    this.replyContent = '';
    this.error = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(isReplied: boolean): string {
    return isReplied
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  }

  getStatusText(isReplied: boolean): string {
    return isReplied ? 'Replied' : 'Pending';
  }
}
