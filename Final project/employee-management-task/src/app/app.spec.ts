import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './login/login.component';

@Component({ template: '<h1>Dashboard test page</h1>' })
class DashboardTestComponent {}

const testRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardTestComponent }
];

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(testRoutes)]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should hide app navigation on login and navigate to dashboard after valid demo sign-in', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/login');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-header')).toBeNull();

    const email = compiled.querySelector('#email') as HTMLInputElement;
    const password = compiled.querySelector('#password') as HTMLInputElement;
    email.value = 'demo@example.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'demopassword';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    compiled.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });
});
