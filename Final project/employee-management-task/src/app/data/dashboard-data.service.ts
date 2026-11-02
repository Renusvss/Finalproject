import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EmployeeApiService } from '../employees/employee-api.service';
import { Employee } from '../employees/employee.model';
import { TaskApiService } from '../tasks/task-api.service';
import { Task, TaskStatus } from '../tasks/task.model';

interface DashboardStatistic {
  label: string;
  value: number;
}

interface TaskSummaryItem {
  status: TaskStatus;
  count: number;
}

export interface DashboardOverview {
  statistics: DashboardStatistic[];
  recentEmployees: Employee[];
  taskSummary: TaskSummaryItem[];
}

const taskStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly taskApi = inject(TaskApiService);
  private readonly employees = signal<Employee[]>([]);
  private readonly tasks = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  readonly overview = computed<DashboardOverview>(() => {
    const employees = this.employees();
    const tasks = this.tasks();
    const recentEmployees = [...employees]
      .sort((first, second) => second.joiningDate.localeCompare(first.joiningDate))
      .slice(0, 4);

    return {
      statistics: [
        { label: 'Total employees', value: employees.length },
        { label: 'Active employees', value: employees.filter((employee) => employee.status === 'Active').length },
        { label: 'Total tasks', value: tasks.length },
        { label: 'Pending tasks', value: tasks.filter((task) => task.status === 'Pending').length },
        { label: 'Tasks in progress', value: tasks.filter((task) => task.status === 'In Progress').length },
        { label: 'Completed tasks', value: tasks.filter((task) => task.status === 'Completed').length }
      ],
      recentEmployees,
      taskSummary: taskStatuses.map((status) => ({
        status,
        count: tasks.filter((task) => task.status === status).length
      }))
    };
  });

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    forkJoin({ employees: this.employeeApi.getEmployees(), tasks: this.taskApi.getTasks() }).subscribe({
      next: ({ employees, tasks }) => {
        this.employees.set(employees);
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Dashboard data could not be loaded. Please try again.');
        this.loading.set(false);
      }
    });
  }
}