import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/** Mensagem de erro de um campo: aparece depois que a pessoa mexeu no campo ou tentou enviar. */
@Component({
  selector: 'app-field-error',
  template: `<small *ngIf="message" [id]="errorId" role="alert">{{ message }}</small>`,
  styles: [
    `
      small {
        display: block;
        margin-top: 4px;
        color: #b3261e;
        font-family: 'Roboto Mono', monospace;
        font-size: 13px;
        line-height: 1.4;
      }
    `
  ]
})
export class FieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() errorId = '';
  @Input() messages: Record<string, string> = {};

  get message(): string | null {
    const errors = this.control?.errors;
    if (!this.control?.touched || !errors) {
      return null;
    }
    const key = Object.keys(errors).find((k) => this.messages[k]);
    return key ? this.messages[key] : null;
  }
}
