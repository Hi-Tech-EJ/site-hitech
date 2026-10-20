import { Component } from '@angular/core';
import { templateTextService } from '@app/services/templateText.service';

interface LinkItem {
  label: string;
  /** rota interna (routerLink) ou endereco externo (href): so um dos dois */
  route?: string;
  url?: string;
  /** caminhos SVG (viewBox 24, traco) do icone */
  icon: string[];
}

/**
 * Pagina de links no estilo Linktree. Nao aparece no menu, no rodape nem no
 * sitemap e sai do indice do Google (ver rota em app-routing.module.ts): so
 * se chega a ela digitando ou compartilhando o endereco /links.
 */
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent {
  logo = 'assets/logo-claro.svg';
  links: LinkItem[] = [];

  /** Endereco do portfolio. Vazio = o botao nao aparece. */
  private readonly portfolioUrl = '';

  constructor(templateTextService: templateTextService) {
    templateTextService.templateText$.subscribe((data) => {
      const redes: Array<{ nome: string; url: string }> = data.footer?.RedesSociais ?? [];
      const rede = (nome: string) => redes.find((item) => item.nome === nome)?.url;

      const all: Array<LinkItem | null> = [
        {
          label: 'Instagram',
          url: rede('Instagram'),
          icon: [
            'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z',
            'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
            'M17.5 6.5h.01'
          ]
        },
        {
          label: 'LinkedIn',
          url: rede('LinkedIn'),
          icon: [
            'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
            'M2 9h4v12H2z',
            'M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z'
          ]
        },
        {
          label: 'Site',
          route: '/',
          icon: [
            'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
            'M2 12h20',
            'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
          ]
        },
        this.portfolioUrl
          ? {
              label: 'Portfólio',
              url: this.portfolioUrl,
              icon: [
                'M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
                'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'
              ]
            }
          : null
      ];

      // sem endereco (ex.: rede removida do template), o botao nao aparece
      this.links = all.filter((item): item is LinkItem => !!item && !!(item.route || item.url));
    });
  }
}
