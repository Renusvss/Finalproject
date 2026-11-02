import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeApiService } from './employee-api.service';
import { EmployeeStatus } from './employee.model';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');
  protected submitted = false;

  protected readonly employeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
    department: ['', [Validators.required, Validators.maxLength(50)]],
    role: ['', [Validators.required, Validators.maxLength(50)]],
    joiningDate: ['', Validators.required],
    status: ['Active' as EmployeeStatus, Validators.required]
  });

  protected isInvalid(controlName: keyof typeof this.employeeForm.controls): boolean {
    const control = this.employeeForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  protected resetForm(): void {
    this.employeeForm.reset({
      firstName: '', lastName: '', email: '', phone: '', department: '', role: '', joiningDate: '', status: 'Active'
    });
    this.errorMessage.set('');
    this.submitted = false;
  }

  protected submit(): void {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { firstName, lastName, ...details } = this.employeeForm.getRawValue();
    this.employeeApi.createEmployee({ ...details, name: `${firstName} ${lastName}` }).subscribe({
      next: () => this.router.navigate(['/employees'], { queryParams: { created: 'employee' } }),
      error: () => {
        this.errorMessage.set('Employee could not be created. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}