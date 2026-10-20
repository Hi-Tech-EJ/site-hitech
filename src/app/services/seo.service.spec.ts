import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
  });

  it('should keep pages indexable by default', () => {
    service.update({ title: 'Teste', description: 'Descrição' });
    expect(meta.getTag('name="robots"')?.content).toBe('index, follow');
  });

  it('should mark noindex pages', () => {
    service.update({ title: 'Teste', description: 'Descrição', noindex: true });
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, follow');
  });
});
