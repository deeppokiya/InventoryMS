import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ReportsService, InventorySummary } from '../../services/reports.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: InventorySummary | null = null;
  recentProducts: any[] = [];
  lowStockProducts: any[] = [];
  loading = true;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    // Load recent products for all users
    this.productService.getAll(undefined, undefined, 1, 5).subscribe({
      next: (res) => {
        this.recentProducts = res.data;
        this.loading = false;
      }
    });

    // Admin: load summary and low stock
    if (this.authService.isAdmin()) {
      this.reportsService.getSummary().subscribe({
        next: (s) => this.summary = s
      });
      this.reportsService.getLowStock(10).subscribe({
        next: (p) => this.lowStockProducts = p.slice(0, 5)
      });
    }
  }
}
