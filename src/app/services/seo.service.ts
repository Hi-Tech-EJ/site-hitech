import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SeoData {
  title: string;
  description: string;
  /** Pagina fora do indice (ex: 404). Padrao: indexavel. */
  noindex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteName = 'Hi Tech';
  private readonly baseUrl = 'https://hitech.org.br';

  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  update(data: SeoData): void {
    const fullTitle = `${data.title} | ${this.siteName}`;
    const url = this.canonicalUrl();

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'robots', content: data.noindex ? 'noindex, follow' : 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: url });

    // Twitter / X
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });

    this.setCanonical(url);
  }

  /**
   * Insere (ou troca) um bloco JSON-LD proprio da pagina atual, alem do
   * Organization/WebSite fixos do index.html. Quem chama deve remover no
   * ngOnDestroy para o bloco nao vazar para a proxima rota.
   */
  setJsonLd(id: string, data: object): void {
    let script = this.document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);

    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-jsonld', id);
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }

  removeJsonLd(id: string): void {
    this.document.head.querySelector(`script[data-jsonld="${id}"]`)?.remove();
  }

  /**
   * URL absoluta da rota atual, sem query string nem fragmento.
   */
  private canonicalUrl(): string {
    const path = this.router.url.split(/[?#]/)[0];
    return `${this.baseUrl}${path}`;
  }

  /**
   * O <link rel="canonical"> do index.html e fixo na home. Sem atualizar por
   * rota, toda pagina se declara copia da home e sai do indice.
   * Via DOCUMENT para funcionar tambem na pre-renderizacao no servidor.
   */
  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
