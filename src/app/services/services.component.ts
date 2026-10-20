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
      title: 'Sites e Sistemas Web',
      description: 'Construímos e mantemos sites e sistemas web sob medida, modernos, responsivos e com suporte contínuo para acompanhar o crescimento do seu negócio.',
      icon: ['M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 21h8', 'M12 17v4'],
      flipped: false
    },
    {
      number: '02',
      title: 'Sistemas Legados',
      description: 'Melhoramos e damos manutenção em sistemas antigos, corrigindo falhas e modernizando o que já existe sem parar a sua operação.',
      icon: ['M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5', 'M12 7v5l4 2'],
      flipped: false
    },
    {
      number: '03',
      title: 'E-mail, Domínio e Hospedagem',
      description: 'Configuramos e mantemos e-mail corporativo, domínio e hospedagem, deixando a base digital da sua empresa no ar e monitorada.',
      icon: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M22 7l-10 6L2 7'],
      flipped: false
    },
    {
      number: '04',
      title: 'Aplicativos Mobile',
      description: 'Desenvolvemos e evoluímos aplicativos mobile, do protótipo à publicação, com foco em usabilidade e desempenho.',
      icon: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M12 18h.01'],
      flipped: false
    },
    {
      number: '05',
      title: 'Coleta e Análise de Dados',
      description: 'Coletamos, organizamos e analisamos os dados do seu negócio, transformando informação dispersa em decisões embasadas.',
      icon: ['M3 3v18h18', 'M7 14l4-4 3 3 5-6'],
      flipped: false
    },
    {
      number: '06',
      title: 'Sistemas de Autoatendimento',
      description: 'Criamos sistemas de autoatendimento que reduzem filas e trabalho manual, dando autonomia e agilidade para o seu cliente.',
      icon: ['M5 3h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8 21h8', 'M12 16v5', 'M9 9.5l2 2 4-4'],
      flipped: false
    },
    {
      number: '07',
      title: 'Automações',
      description: 'Automatizamos tarefas repetitivas com integrações, APIs e bots, reduzindo trabalho manual e ganhando eficiência.',
      icon: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
      flipped: false
    },
    {
      number: '08',
      title: 'E-commerce',
      description: 'Construímos e evoluímos lojas virtuais completas, com catálogo, pagamento e gestão de pedidos integrados.',
      icon: ['M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5.1', 'M9 21h.01', 'M19 21h.01'],
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
      name: 'Serviços da Hi Tech',
      itemListElement: this.services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          provider: { '@id': 'https://hitech.org.br/#organization' },
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
