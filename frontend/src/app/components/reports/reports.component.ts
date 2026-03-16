import { Component, OnInit } from '@angular/core';
import { ReportsService, InventorySummary, CategoryStat } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  summary: InventorySummary | null = null;
  lowStockProducts: any[] = [];
  categoryStats: CategoryStat[] = [];
  lowStockThreshold = 10;
  loading = true;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;

    this.reportsService.getSummary().subscribe({
      next: (s) => this.summary = s
    });

    this.reportsService.getLowStock(this.lowStockThreshold).subscribe({
      next: (p) => { this.lowStockProducts = p; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.reportsService.getCategoryStats().subscribe({
      next: (stats) => this.categoryStats = stats
    });
  }

  onThresholdChange(): void {
    this.reportsService.getLowStock(this.lowStockThreshold).subscribe({
      next: (p) => this.lowStockProducts = p
    });
  }

  getBarWidth(value: number): string {
    if (!this.categoryStats.length) return '0%';
    const max = Math.max(...this.categoryStats.map(s => s.productCount));
    return `${(value / max) * 100}%`;
  }
}
