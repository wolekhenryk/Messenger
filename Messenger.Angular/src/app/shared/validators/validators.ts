import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const valid = hasUpperCase && hasDigit && hasSpecialChar;
  return valid ? null : { strongPassword: true };
}

export function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}
