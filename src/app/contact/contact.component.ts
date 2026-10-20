import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormSubmitService } from '@app/shared/form-submit.service';
import { focusFirstInvalid } from '@app/shared/form-utils';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  form: FormGroup;
  isLoading = false;

  private apiUrl = "https://script.google.com/macros/s/AKfycbwSrUCO9dx6bTOBEjaUHYMgQ0i6nblIku5bquQoOYDmioYzmjCd1PNG_Io__eYXsn-i7Q/exec";

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private formSubmit: FormSubmitService,
    private host: ElementRef<HTMLElement>
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      description: [null, [Validators.required, Validators.minLength(10)]]
    });
  }

  showError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.touched && control.invalid;
  }

  async publishTask() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }

    this.isLoading = true;

    try {
      await this.formSubmit.send(this.apiUrl, {
        name: this.form.value.name,
        email: this.form.value.email,
        description: this.form.value.description
      });

      this.toastr.success('Mensagem enviada com sucesso!');
      this.form.reset();

    } catch (error) {
      this.toastr.error('Não conseguimos enviar agora. Confira sua conexão e tente de novo.');

    } finally {
      this.isLoading = false;
    }
  }
}
