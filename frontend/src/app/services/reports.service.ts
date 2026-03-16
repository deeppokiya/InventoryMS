import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface CategoryStat {
  category: string;
  productCount: number;
  totalQuantity: number;
  totalValue: number;
  avgPrice: number;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/adminreports`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<InventorySummary> {
    return this.http.get<InventorySummary>(`${this.apiUrl}/summary`);
  }

  getLowStock(threshold = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lowstock?threshold=${threshold}`);
  }

  getProductReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getCategoryStats(): Observable<CategoryStat[]> {
    return this.http.get<CategoryStat[]>(`${this.apiUrl}/categories`);
  }
}
