import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskRequest, Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/tasks';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.endpoint);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.endpoint}/${id}`);
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.endpoint, request);
  }
}
