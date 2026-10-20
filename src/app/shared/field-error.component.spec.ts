import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FieldErrorComponent } from './field-error.component';

describe('FieldErrorComponent', () => {
  let fixture: ComponentFixture<FieldErrorComponent>;
  let component: FieldErrorComponent;
  let control: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [FieldErrorComponent] }).compileComponents();

    fixture = TestBed.createComponent(FieldErrorComponent);
    component = fixture.componentInstance;
    control = new FormControl(null, Validators.required);
    component.control = control;
    component.errorId = 'campo-error';
    component.messages = { required: 'Campo obrigatório.' };
  });

  it('stays hidden until the control is touched', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('small')).toBeNull();
  });

  it('shows the message for the first matching error once touched', () => {
    control.markAsTouched();
    fixture.detectChanges();
    const small = fixture.nativeElement.querySelector('small') as HTMLElement;
    expect(small.textContent).toBe('Campo obrigatório.');
    expect(small.id).toBe('campo-error');
  });

  it('hides again when the control becomes valid', () => {
    control.markAsTouched();
    control.setValue('ok');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('small')).toBeNull();
  });
});
