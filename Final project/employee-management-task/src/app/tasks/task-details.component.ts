import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeApiService } from '../employees/employee-api.service';
import { Employee } from '../employees/employee.model';
import { TaskApiService } from './task-api.service';
import { Task } from './task.model';
import { distinctUntilChanged, map, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly taskApi = inject(TaskApiService);
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly task = signal<Task | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly employeeError = signal(false);
  private readonly employees = signal<Employee[]>([]);
  protected readonly assignedEmployee = computed(() => {
    const task = this.task();
    return task ? this.employees().find((employee) => employee.id === task.assignedEmployeeId) : undefined;
  });

  ngOnInit(): void {
    this.employeeApi.getEmployees().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.employeeError.set(true)
    });
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      distinctUntilChanged(),
      switchMap((id) => {
        this.loading.set(true);
        this.errorMessage.set('');
        this.task.set(null);
        return Number.isInteger(id) && id > 0
          ? this.taskApi.getTask(id)
          : throwError(() => new Error('Invalid task ID.'));
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Task could not be found. Check the link or try again later.');
        this.loading.set(false);
      }
    });
  }
}
