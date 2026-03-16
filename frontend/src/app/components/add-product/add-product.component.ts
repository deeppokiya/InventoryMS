import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  form: FormGroup;
  loading = false;
  error = '';

  categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Sports', 'Books', 'Health & Beauty', 'Automotive', 'Tools', 'Other'];

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
    this.form = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.productService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to create product.';
        this.loading = false;
      }
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
