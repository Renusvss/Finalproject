import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeApiService } from '../employees/employee-api.service';
import { Employee } from '../employees/employee.model';
import { TaskApiService } from './task-api.service';
import { CreateTaskRequest, TaskPriority, TaskStatus } from './task.model';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly taskApi = inject(TaskApiService);
  private readonly router = inject(Router);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly employeeLoading = signal(true);
  protected readonly employeeError = signal('');
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');
  protected submitted = false;

  protected readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    assignedEmployeeId: ['', Validators.required],
    priority: ['Medium' as TaskPriority, Validators.required],
    status: ['Pending' as TaskStatus, Validators.required],
    dueDate: ['', Validators.required]
  });

  ngOnInit(): void {
    this.employeeApi.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.employeeLoading.set(false);
      },
      error: () => {
        this.employeeError.set('Employees could not be loaded. Try again before creating a task.');
        this.employeeLoading.set(false);
      }
    });
  }

  protected isInvalid(controlName: keyof typeof this.taskForm.controls): boolean {
    const control = this.taskForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  protected retryEmployees(): void {
    this.employeeLoading.set(true);
    this.employeeError.set('');
    this.employeeApi.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.employeeLoading.set(false);
      },
      error: () => {
        this.employeeError.set('Employees could not be loaded. Try again before creating a task.');
        this.employeeLoading.set(false);
      }
    });
  }

  protected resetForm(): void {
    this.taskForm.reset({
      title: '', description: '', assignedEmployeeId: '', priority: 'Medium', status: 'Pending', dueDate: ''
    });
    this.errorMessage.set('');
    this.submitted = false;
  }

  protected submit(): void {
    this.submitted = true;
    this.errorMessage.set('');
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const values = this.taskForm.getRawValue();
    const request: CreateTaskRequest = { ...values, assignedEmployeeId: Number(values.assignedEmployeeId) };
    this.submitting.set(true);
    this.taskApi.createTask(request).subscribe({
      next: () => this.router.navigate(['/tasks'], { queryParams: { created: 'task' } }),
      error: () => {
        this.errorMessage.set('Task could not be created. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}
