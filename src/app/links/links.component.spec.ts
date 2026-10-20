import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LinksComponent } from './links.component';

describe('LinksComponent', () => {
  let fixture: ComponentFixture<LinksComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LinksComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LinksComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should list Instagram, LinkedIn and the site', () => {
    const labels = Array.from(el.querySelectorAll('.link-label')).map((n) => n.textContent?.trim());
    expect(labels).toEqual(['Instagram', 'LinkedIn', 'Site']);
  });

  it('should open external links in a new tab safely', () => {
    const external = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href^="http"]'));
    expect(external.length).toBe(2);
    external.forEach((a) => {
      expect(a.target).toBe('_blank');
      expect(a.rel).toContain('noopener');
    });
  });
});
