import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ContactComponent } from './contact.component';
import { FieldErrorComponent } from '../shared/field-error.component';


describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ToastrModule.forRoot()],
      declarations: [ContactComponent, FieldErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the submit button enabled and show errors on an empty submit', () => {
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLButtonElement>('button.enviar')!;
    expect(button.disabled).toBeFalse();

    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const errors = Array.from(el.querySelectorAll('small[role="alert"]')).map((e) => e.textContent);
    expect(errors).toEqual([
      'Informe seu nome.',
      'Informe seu e-mail.',
      'Conte o que você precisa.'
    ]);
    expect(el.querySelector('#nome')?.getAttribute('aria-invalid')).toBe('true');
  });
});
