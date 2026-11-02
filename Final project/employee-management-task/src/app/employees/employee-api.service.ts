import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/employees';

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.endpoint);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.endpoint}/${id}`);
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.endpoint, employee);
  }
}