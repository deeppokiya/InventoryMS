import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService, Staff } from '../../services/staff.service';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  staffList: Staff[] = [];
  loading = true;
  showForm = false;
  form: FormGroup;
  submitLoading = false;
  deleteId: string | null = null;
  successMsg = '';
  errorMsg = '';

  constructor(private staffService: StaffService, private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.loading = true;
    this.staffService.getAll().subscribe({
      next: (list) => { this.staffList = list; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onAddStaff(): void {
    if (this.form.invalid) return;
    this.submitLoading = true;
    this.errorMsg = '';

    this.staffService.create(this.form.value).subscribe({
      next: () => {
        this.successMsg = 'Staff member added successfully!';
        this.showForm = false;
        this.form.reset();
        this.submitLoading = false;
        this.loadStaff();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to add staff.';
        this.submitLoading = false;
      }
    });
  }

  confirmDelete(id: string): void {
    this.deleteId = id;
  }

  doDelete(): void {
    if (!this.deleteId) return;
    this.staffService.delete(this.deleteId).subscribe({
      next: () => {
        this.successMsg = 'Staff member removed.';
        this.deleteId = null;
        this.loadStaff();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.errorMsg = 'Failed to delete.'; }
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
