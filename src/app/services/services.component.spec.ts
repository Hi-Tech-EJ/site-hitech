import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ServicesComponent } from './services.component';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose each service as a keyboard-operable toggle', () => {
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.flip-toggle');
    expect(buttons.length).toBe(component.services.length);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');

    buttons[0].click();
    fixture.detectChanges();

    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(component.services[0].flipped).toBeTrue();
  });

  it('should publish a Service list as JSON-LD and remove it on destroy', () => {
    const selector = 'script[data-jsonld="services"]';
    const script = document.head.querySelector(selector);
    const data = JSON.parse(script?.textContent ?? '{}');
    expect(data['@type']).toBe('ItemList');
    expect(data.itemListElement.length).toBe(component.services.length);

    fixture.destroy();
    expect(document.head.querySelector(selector)).toBeNull();
  });
});
