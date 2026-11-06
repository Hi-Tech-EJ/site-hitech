import { AfterViewInit, Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from './seo.service';
import { MotionKit, MotionService } from '@app/shared/motion.service';
import { animateCards, flipCard } from '@app/shared/card-motion';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly jsonLdId = 'services';
  private kit: MotionKit | null = null;
  private stopMotion?: () => void;
  private destroyed = false;

  /** com o GSAP no comando, o CSS deixa de animar o giro e o hover sozinho */
  @HostBinding('class.gsap-ready') gsapReady = false;

  constructor(
    private seo: SeoService,
    private motion: MotionService,
    private zone: NgZone,
    private host: ElementRef<HTMLElement>
  ) {}

  services = [
    {
      number: '01',
      title: 'Este Portfólio',
      description: 'Site pessoal feito em Angular a partir da landing page da Hi Tech: novas cores, textos, páginas e imagens, rodando em Docker com nginx.',
      icon: ['M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 21h8', 'M12 17v4'],
      flipped: false
    },
    {
      number: '02',
      title: 'Projetos da Hi Tech',
      description: 'Participação em eventos e projetos reais da empresa júnior.',
      icon: ['M16 18L22 12L16 6', 'M8 6L2 12L8 18'],
      flipped: false
    },
    {
      number: '03',
      title: 'Trabalhos da Faculdade',
      description: 'Programas e aplicativos desenvolvidos durante a graduação: projetos de disciplinas, atividades complementares e trabalhos em grupo.',
      icon: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'],
      flipped: false
    },
    {
      number: '04',
      title: 'Próximo Projeto',
      description: 'Se você tem sugestões ou quer colaborar, entre em contato com a gente!',
      icon: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
      flipped: false
    }
  ];

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.motion.load().then((kit) => {
        if (!kit || this.destroyed) {
          return;
        }
        this.kit = kit;
        this.stopMotion = animateCards(kit, this.host.nativeElement, { cards: '.card', icon: '.card-icon' });
        this.zone.run(() => (this.gsapReady = true));
      });
    });
  }

  toggle(service: { flipped: boolean }, event: Event): void {
    service.flipped = !service.flipped;

    const card = (event.currentTarget as HTMLElement).closest<HTMLElement>('.card');
    if (this.kit && card) {
      const kit = this.kit;
      this.zone.runOutsideAngular(() => flipCard(kit, card, service.flipped));
    }
  }

  ngOnInit(): void {
    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Projetos da Carolina',
      itemListElement: this.services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          provider: { '@id': 'https://carolina-portfolio.example.com/#person' },
          areaServed: 'BR',
        },
      })),
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopMotion?.();
    this.seo.removeJsonLd(this.jsonLdId);
  }
}
