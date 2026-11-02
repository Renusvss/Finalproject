import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EmployeeApiService } from '../employees/employee-api.service';
import { TaskApiService } from './task-api.service';
import { TaskListComponent } from './task-list.component';
import { Task } from './task.model';

const sampleTasks: Task[] = [
  { id: 1, title: 'Complete onboarding', description: 'Prepare forms.', assignedEmployeeId: 1, priority: 'High', status: 'Pending', dueDate: '2026-11-10' },
  { id: 2, title: 'Review policy', description: 'Review HR policy.', assignedEmployeeId: 2, priority: 'Medium', status: 'Pending', dueDate: '2026-11-12' },
  { id: 3, title: 'Prepare report', description: 'Write team report.', assignedEmployeeId: 1, priority: 'High', status: 'Completed', dueDate: '2026-11-14' }
];

describe('TaskListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideRouter([]),
        { provide: TaskApiService, useValue: { getTasks: () => of(sampleTasks) } },
        { provide: EmployeeApiService, useValue: { getEmployees: () => of([]) } }
      ]
    }).compileComponents();
  });

  it('updates task results immediately from title, status, and priority filters', () => {
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const rows = (): NodeListOf<HTMLTableRowElement> => element.querySelectorAll('tbody tr');
    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    const [status, priority] = Array.from(element.querySelectorAll('select'));

    expect(rows().length).toBe(3);

    search.value = 'report';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Prepare report');

    search.value = '';
    search.dispatchEvent(new Event('input'));
    status.value = 'Pending';
    status.dispatchEvent(new Event('change'));
    priority.value = 'High';
    priority.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Complete onboarding');

    status.value = 'Completed';
    status.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Prepare report');
  });
});
