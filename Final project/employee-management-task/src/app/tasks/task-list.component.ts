import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { EmployeeApiService } from '../employees/employee-api.service';
import { Employee } from '../employees/employee.model';
import { TaskApiService } from './task-api.service';
import { Task, TaskPriority, TaskStatus } from './task.model';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly taskApi = inject(TaskApiService);
  private readonly employeeApi = inject(EmployeeApiService);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly employeeError = signal(false);
  protected readonly searchText = signal('');
  protected readonly selectedStatus = signal<TaskStatus | 'All'>('All');
  protected readonly selectedPriority = signal<TaskPriority | 'All'>('All');
  protected readonly createdMessage = signal('');
  protected readonly employeeNames = computed(() => new Map(this.employees().map((employee) => [employee.id, employee.name])));
  protected readonly filteredTasks = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    const status = this.selectedStatus();
    const priority = this.selectedPriority();

    return this.tasks().filter((task) =>
      (!query || task.title.toLowerCase().includes(query)) &&
      (status === 'All' || task.status === status) &&
      (priority === 'All' || task.priority === priority)
    ).sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('created') === 'task') {
      this.createdMessage.set('Task added successfully.');
    }
    this.loadTasks();
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.employeeError.set(false);
    this.employeeApi.getEmployees().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.employeeError.set(true)
    });
  }

  protected loadTasks(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.taskApi.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Tasks could not be loaded. Please try again.');
        this.loading.set(false);
      }
    });
  }

  protected updateSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  protected updateStatus(event: Event): void {
    this.selectedStatus.set((event.target as HTMLSelectElement).value as TaskStatus | 'All');
  }

  protected updatePriority(event: Event): void {
    this.selectedPriority.set((event.target as HTMLSelectElement).value as TaskPriority | 'All');
  }

  protected clearFilters(): void {
    this.searchText.set('');
    this.selectedStatus.set('All');
    this.selectedPriority.set('All');
  }

  protected employeeName(id: number): string {
    return this.employeeNames().get(id) ?? (this.employeeError() ? `Employee #${id}` : 'Loading...');
  }
}
