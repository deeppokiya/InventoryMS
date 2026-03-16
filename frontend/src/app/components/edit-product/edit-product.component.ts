import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  loading = false;
  loadingData = true;
  error = '';
  success = '';
  productId!: number;

  categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Sports', 'Books', 'Health & Beauty', 'Automotive', 'Tools', 'Other'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(this.productId).subscribe({
      next: (p) => {
        this.form.patchValue(p);
        this.loadingData = false;
      },
      error: () => {
        this.error = 'Product not found.';
        this.loadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.productService.update(this.productId, this.form.value).subscribe({
      next: () => {
        this.success = 'Product updated successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/products']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update product.';
        this.loading = false;
      }
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
