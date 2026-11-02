import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeApiService } from './employee-api.service';
import { Employee, EmployeeStatus } from './employee.model';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeApi = inject(EmployeeApiService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly searchTerm = signal('');
  protected readonly selectedDepartment = signal('All');
  protected readonly selectedStatus = signal('All');
  protected readonly createdMessage = signal('');
  protected readonly departments = computed(() =>
    [...new Set(this.employees().map((employee) => employee.department))].sort()
  );
  protected readonly filteredEmployees = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const department = this.selectedDepartment();
    const status = this.selectedStatus();

    return this.employees().filter((employee) => {
      const matchesSearch = !searchTerm || [employee.name, employee.email, employee.role]
        .some((value) => value.toLowerCase().includes(searchTerm));
      const matchesDepartment = department === 'All' || employee.department === department;
      const matchesStatus = status === 'All' || employee.status === status as EmployeeStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('created') === 'employee') {
      this.createdMessage.set('Employee added successfully.');
    }
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.employeeApi.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Employees could not be loaded. Please try again.');
        this.loading.set(false);
      }
    });
  }

  protected updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected updateDepartment(event: Event): void {
    this.selectedDepartment.set((event.target as HTMLSelectElement).value);
  }

  protected updateStatus(event: Event): void {
    this.selectedStatus.set((event.target as HTMLSelectElement).value);
  }
}