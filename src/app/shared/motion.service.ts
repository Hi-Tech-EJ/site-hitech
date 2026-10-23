import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface MotionKit {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
}

/**
 * Carrega o GSAP sob demanda e so no navegador: o site e prerenderizado, entao
 * nada aqui pode rodar no servidor, e a biblioteca fica fora do bundle inicial.
 *
 * Se o carregamento falhar (ou demorar demais), a pagina marca
 * `html.motion-off` e o CSS volta a mostrar os cartoes que estavam escondidos
 * esperando a animacao de entrada.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private kit?: Promise<MotionKit | null>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  load(): Promise<MotionKit | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(null);
    }

    if (!this.kit) {
      const root = this.document.documentElement;
      const giveUp = setTimeout(() => root.classList.add('motion-off'), 4000);

      this.kit = Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/DrawSVGPlugin'),
      ])
        .then(([core, scroll, draw]) => {
          core.gsap.registerPlugin(scroll.ScrollTrigger, draw.DrawSVGPlugin);
          return { gsap: core.gsap, ScrollTrigger: scroll.ScrollTrigger };
        })
        .catch(() => {
          root.classList.add('motion-off');
          return null;
        })
        .finally(() => clearTimeout(giveUp));
    }

    return this.kit;
  }
}
