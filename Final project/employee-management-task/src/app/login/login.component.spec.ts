import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<LoginComponent>>;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    navigate = vi.fn().mockResolvedValue(true);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: Router, useValue: { navigate } }]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('shows a required password message and blocks an invalid login', () => {
    fixture.componentInstance['loginForm'].controls.email.setValue('person@example.com');
    fixture.componentInstance['loginForm'].controls.password.setValue('');
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#password-error')?.textContent).toContain('Password is required.');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows the minimum password length message', () => {
    fixture.componentInstance['loginForm'].controls.email.setValue('person@example.com');
    fixture.componentInstance['loginForm'].controls.password.setValue('short');
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#password-error')?.textContent).toContain('at least 8 characters');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows the maximum password length message', () => {
    fixture.componentInstance['loginForm'].controls.email.setValue('person@example.com');
    fixture.componentInstance['loginForm'].controls.password.setValue('x'.repeat(65));
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#password-error')?.textContent).toContain('no more than 64 characters');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('navigates to the dashboard after valid submission', async () => {
    fixture.componentInstance['loginForm'].controls.email.setValue('person@example.com');
    fixture.componentInstance['loginForm'].controls.password.setValue('validpass');
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
