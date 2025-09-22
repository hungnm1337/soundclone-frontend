import { Component, OnInit } from '@angular/core';
import { AnalysisService, MonthlyAmount, MonthlyCount } from '../../../Services/Admin/analysis.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-system-analysis',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './system-analysis.component.html',
  styleUrl: './system-analysis.component.scss'
})
export class SystemAnalysisComponent implements OnInit {

  GetUserRegistrationCountByMonth: MonthlyCount[] = [];
  GetTrackUploadCountByMonth: MonthlyCount[] = [];
  GetTotalInvoiceAmountByMonth: MonthlyAmount[] = [];
  GetInvoiceCountByMonth: MonthlyCount[] = [];

  loading = true;
  error: string | null = null;

  // Chart data for ngx-charts
  userRegistrationChartData: any[] = [];
  trackUploadChartData: any[] = [];
  revenueChartData: any[] = [];
  invoiceCountChartData: any[] = [];

  // Chart options
  chartOptions = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'Month',
    yAxisLabel: 'Count',
    colorScheme: {
      domain: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
    }
  };

  revenueChartOptions = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: false,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'Month',
    yAxisLabel: 'Revenue (VND)',
    colorScheme: {
      domain: ['#F59E0B']
    }
  };

  constructor(private analysisService: AnalysisService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    this.error = null;

    // Load all data in parallel
    Promise.all([
      this.analysisService.GetUserRegistrationCountByMonth().toPromise(),
      this.analysisService.GetTrackUploadCountByMonth().toPromise(),
      this.analysisService.GetTotalInvoiceAmountByMonth().toPromise(),
      this.analysisService.GetInvoiceCountByMonth().toPromise()
    ]).then(([userReg, trackUpload, invoiceAmount, invoiceCount]) => {
      this.GetUserRegistrationCountByMonth = userReg || [];
      this.GetTrackUploadCountByMonth = trackUpload || [];
      this.GetTotalInvoiceAmountByMonth = invoiceAmount || [];
      this.GetInvoiceCountByMonth = invoiceCount || [];

      // Transform data for ngx-charts
      this.transformChartData();
      this.loading = false;
    }).catch(error => {
      this.error = 'Unable to load analysis data';
      this.loading = false;
      console.error('Error loading analysis data:', error);
    });
  }

  // Helper methods for chart data
  getMaxValue(data: (MonthlyCount | MonthlyAmount)[]): number {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(item => 'count' in item ? item.count : item.amount));
  }

  getBarHeight(value: number, maxValue: number): number {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  }

  formatMonth(month: number): string {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    return months[month - 1] || '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getTotalUsers(): number {
    return this.GetUserRegistrationCountByMonth.reduce((sum, item) => sum + item.count, 0);
  }

  getTotalTracks(): number {
    return this.GetTrackUploadCountByMonth.reduce((sum, item) => sum + item.count, 0);
  }

  getTotalRevenue(): number {
    return this.GetTotalInvoiceAmountByMonth.reduce((sum, item) => sum + item.amount, 0);
  }

  getTotalInvoices(): number {
    return this.GetInvoiceCountByMonth.reduce((sum, item) => sum + item.count, 0);
  }

  transformChartData() {
    // Transform user registration data
    this.userRegistrationChartData = this.GetUserRegistrationCountByMonth.map(item => ({
      name: `${this.formatMonth(item.month)}/${item.year}`,
      value: item.count
    }));

    // Transform track upload data
    this.trackUploadChartData = this.GetTrackUploadCountByMonth.map(item => ({
      name: `${this.formatMonth(item.month)}/${item.year}`,
      value: item.count
    }));

    // Transform revenue data
    this.revenueChartData = this.GetTotalInvoiceAmountByMonth.map(item => ({
      name: `${this.formatMonth(item.month)}/${item.year}`,
      value: item.amount
    }));

    // Transform invoice count data
    this.invoiceCountChartData = this.GetInvoiceCountByMonth.map(item => ({
      name: `${this.formatMonth(item.month)}/${item.year}`,
      value: item.count
    }));
  }
}
