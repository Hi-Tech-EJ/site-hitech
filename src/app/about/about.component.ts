import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { templateTextService } from '@app/services/templateText.service';
import { ToastrService } from 'ngx-toastr';
import { FormSubmitService } from '@app/shared/form-submit.service';
import { focusFirstInvalid } from '@app/shared/form-utils';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Input() description: string = '';

  templateText: any = {};

  @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('reviewGrid') reviewGrid!: ElementRef;

  form: FormGroup;
  isLoading = false;

  private apiUrl = "https://script.google.com/macros/s/AKfycbw7bvxnEtAzzHDI5jykNIoo2iTIT0ixBY-wJigVsAqboPD5jRc7ZOBGqfeCVVQcn9deUA/exec";

  eventPhotos = [
    { url: 'assets/events/foto2.jpg', title: 'Encontro do time Hi Tech' },
    { url: 'assets/events/foto5.jpg', title: 'Hi Tech no palco — Paraná Júnior 2025' },
    { url: 'assets/events/foto6.jpg', title: 'Reconhecimento Palco Ouro — PRJR 2025' },
    { url: 'assets/events/foto7.jpg', title: 'EJ União e Conexão — PRJR 2025' },
    { url: 'assets/events/foto1.jpg', title: 'Paraná Júnior 2026' },
    { url: 'assets/events/foto4.jpg', title: 'Hi Tech no ECOAR — Curitiba Júnior' },
    { url: 'assets/events/foto3.jpg', title: 'Think high, think tech' }
  ];

  /** Desfaz os listeners de scroll que marcam o card em destaque. */
  private stopTrackingActive: Array<() => void> = [];

  /** Autoplay do carrossel: so roda no celular (ver ngAfterViewInit). */
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private resumeTimer?: ReturnType<typeof setTimeout>;
  private mobileQuery?: MediaQueryList;
  private readonly autoplayIntervalMs = 4000;
  private readonly resumeDelayMs = 8000;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private formSubmit: FormSubmitService,
    private host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      period: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // o site e pre-renderizado no servidor, onde window/setInterval nao
    // existem (e o timer nem teria como ser limpo)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.trackActiveCard(this.reviewGrid?.nativeElement, '.review-card');
    this.trackActiveCard(this.carousel?.nativeElement, '.event-card');

    // quem pediu menos animacao no sistema nao recebe autoplay
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.mobileQuery = window.matchMedia('(max-width: 768px)');
    this.mobileQuery.addEventListener('change', this.onBreakpointChange);
    this.syncAutoplay();
  }

  ngOnDestroy(): void {
    this.stopTrackingActive.forEach((stop) => stop());
    this.stopAutoplay();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
    this.mobileQuery?.removeEventListener('change', this.onBreakpointChange);
  }

  /**
   * Marca com `.is-active` o card mais proximo do centro do container que
   * rola. No toque nao ha hover, entao e esse card que "levanta". O CSS so
   * aplica o estilo em telas estreitas ou sem hover; no desktop a classe
   * existe mas nao muda nada.
   */
  private trackActiveCard(container: HTMLElement | undefined, selector: string): void {
    if (!container) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const cards = Array.from(container.querySelectorAll<HTMLElement>(selector));
      const box = container.getBoundingClientRect();
      const center = box.left + box.width / 2;
      let active: HTMLElement | undefined;
      let best = Infinity;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        if (distance < best) {
          best = distance;
          active = card;
        }
      }
      cards.forEach((card) => card.classList.toggle('is-active', card === active));
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    container.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    this.stopTrackingActive.push(() => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    });
  }

  /** Arrow function para manter o this ao ser usada como listener. */
  private onBreakpointChange = (): void => this.syncAutoplay();

  private syncAutoplay(): void {
    if (this.mobileQuery?.matches) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  private startAutoplay(): void {
    if (this.autoplayTimer) {
      return;
    }
    this.autoplayTimer = setInterval(() => this.advanceCarousel(), this.autoplayIntervalMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  /**
   * Pausa o autoplay e reagenda a volta. Chamado quando a pessoa arrasta ou
   * usa as setas, para o carrossel nao brigar com quem esta navegando.
   */
  pauseAutoplay(): void {
    this.stopAutoplay();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
    this.resumeTimer = setTimeout(() => this.syncAutoplay(), this.resumeDelayMs);
  }

  private advanceCarousel(): void {
    const el = this.carousel?.nativeElement as HTMLElement | undefined;
    if (!el) {
      return;
    }

    const passo = this.cardStep(el);
    const noFim = el.scrollLeft + el.clientWidth >= el.scrollWidth - passo / 2;
    el.scrollTo({ left: noFim ? 0 : el.scrollLeft + passo, behavior: 'smooth' });
  }

  /** Largura real de um card + o gap, lida do DOM em vez de valor fixo. */
  private cardStep(el: HTMLElement): number {
    const card = el.querySelector<HTMLElement>('.event-card');
    if (!card) {
      return el.clientWidth;
    }
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card.offsetWidth + gap;
  }

  showError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.touched && control.invalid;
  }

  async publishTask() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }

    this.isLoading = true;

    try {
      await this.formSubmit.send(this.apiUrl, {
        name: this.form.value.name,
        email: this.form.value.email,
        period: this.form.value.period
      });

      this.toastr.success('Pronto! Avisaremos você quando abrir a próxima seleção.');
      this.form.reset({ name: null, email: null, period: '' });
    } catch (error) {
      this.toastr.error('Não conseguimos enviar agora. Confira sua conexão e tente de novo.');
    } finally {
      this.isLoading = false;
    }
  }

  scrollCarousel(direction: number): void {
    const el = this.carousel?.nativeElement as HTMLElement | undefined;
    if (!el) {
      return;
    }

    this.pauseAutoplay();
    // passo medido do DOM: antes eram 640px fixos, mas cada card ocupa
    // 680 + 24 de gap, entao o desalinhamento ia acumulando a cada clique
    el.scrollBy({ left: direction * this.cardStep(el), behavior: 'smooth' });
  }
}