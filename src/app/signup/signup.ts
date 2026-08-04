import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly formElement = viewChild.required<ElementRef<HTMLFormElement>>('signupForm');
  readonly submitting = signal(false);
  readonly signupForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)],
    ],
    income: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.submitting()) return;

    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) {
      queueMicrotask(() =>
        this.formElement()
          .nativeElement.querySelector<HTMLElement>('.ng-invalid[formControlName]')
          ?.focus(),
      );
      return;
    }

    this.submitting.set(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 650));
    this.signupForm.reset();
    await this.router.navigate(['/confirmacao']);
    this.submitting.set(false);
  }
}
