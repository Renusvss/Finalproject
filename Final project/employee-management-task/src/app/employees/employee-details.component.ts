import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, switchMap, throwError } from 'rxjs';
import { EmployeeApiService } from './employee-api.service';
import { Employee } from './employee.model';

@Component({
  selector: 'app-employee-details',
  imports: [RouterLink],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected employee?: Employee;
  protected loading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      distinctUntilChanged(),
      switchMap((id) => {
        this.loading = true;
        this.errorMessage = '';
        this.employee = undefined;
        return Number.isInteger(id) && id > 0
          ? this.employeeApi.getEmployee(id)
          : throwError(() => new Error('Invalid employee ID.'));
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'The requested employee could not be found.';
        this.loading = false;
      }
    });
  }
}