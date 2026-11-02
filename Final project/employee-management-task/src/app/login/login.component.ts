import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly router = inject(Router);
  protected submitted = false;
  protected feedbackMessage = '';

  protected readonly loginForm = new FormBuilder().nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]]
  });

  protected isInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  protected submit(): void {
    this.submitted = true;
    this.feedbackMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.feedbackMessage = 'Demo sign-in accepted. Opening your dashboard...';
    void this.router.navigate(['/dashboard']);
  }
}