import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  loading = true;
  search = '';
  selectedCategory = '';
  page = 1;
  pageSize = 10;
  total = 0;
  totalPages = 0;
  deleteId: number | null = null;
  deleteLoading = false;
  successMsg = '';
  errorMsg = '';

  constructor(public authService: AuthService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories = cats
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(this.search, this.selectedCategory, this.page, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.page = 1;
    this.loadProducts();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadProducts();
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
  }

  cancelDelete(): void {
    this.deleteId = null;
  }

  doDelete(): void {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.productService.delete(this.deleteId).subscribe({
      next: () => {
        this.successMsg = 'Product deleted successfully.';
        this.deleteId = null;
        this.deleteLoading = false;
        this.loadProducts();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = 'Failed to delete product.';
        this.deleteLoading = false;
      }
    });
  }

  getPages(): number[] {
    const pages = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getStockClass(qty: number): string {
    if (qty === 0) return 'out';
    if (qty <= 10) return 'low';
    return 'ok';
  }

  getStockLabel(qty: number): string {
    if (qty === 0) return 'Out of Stock';
    if (qty <= 10) return 'Low Stock';
    return 'In Stock';
  }
}
