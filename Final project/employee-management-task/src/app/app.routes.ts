import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then((module) => module.DashboardComponent) },
	{ path: 'employees/add', loadComponent: () => import('./employees/add-employee.component').then((module) => module.AddEmployeeComponent) },
	{ path: 'employees/:id', loadComponent: () => import('./employees/employee-details.component').then((module) => module.EmployeeDetailsComponent) },
	{ path: 'employees', loadComponent: () => import('./employees/employee-list.component').then((module) => module.EmployeeListComponent) },
	{ path: 'tasks/add', loadComponent: () => import('./tasks/add-task.component').then((module) => module.AddTaskComponent) },
	{ path: 'tasks/:id', loadComponent: () => import('./tasks/task-details.component').then((module) => module.TaskDetailsComponent) },
	{ path: 'tasks', loadComponent: () => import('./tasks/task-list.component').then((module) => module.TaskListComponent) },
	{ path: 'login', loadComponent: () => import('./login/login.component').then((module) => module.LoginComponent) },
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: '**', redirectTo: 'login' }
];
