import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SeoService, SeoData } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'site-hitech';
  // O conteúdo já é carregado no APP_INITIALIZER, então não há mais tela de loading.
  loading = false;
  /** pagina sem cabecalho/rodape (rota com data.standalone) */
  standalone = false;

  private readonly defaultSeo: SeoData = {
    title: 'Empresa Júnior de Tecnologia e Soluções Digitais',
    description:
      'A Hi Tech cria sites, sistemas web, automações e design de produto. Tire seu projeto do papel com uma empresa júnior de tecnologia.',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService,
    @Inject(DOCUMENT) document: Document
  ) {
    // antes da primeira navegacao terminar o router ainda esta em "/"; o
    // endereco do documento ja vale no servidor (prerender) e no navegador, e
    // evita o rodape piscar (ou a hidratacao divergir) em /links
    this.standalone = this.isStandalone(document.location?.pathname ?? '');
  }

  ngOnInit(): void {
    this.setupSeo();
  }

  private setupSeo(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.standalone = !!data['standalone'];
        const seo = (data['seo'] as SeoData) ?? this.defaultSeo;
        this.seo.update(seo);
      });
  }

  private isStandalone(path: string): boolean {
    const segment = path.split(/[?#]/)[0].replace(/^\/|\/$/g, '');
    return !!this.router.config.find((route) => route.path === segment)?.data?.['standalone'];
  }
}
