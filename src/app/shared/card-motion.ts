import type { MotionKit } from './motion.service';

export interface CardMotionOptions {
  /** seletor dos cartoes dentro do escopo */
  cards: string;
  /** seletor do svg de icone dentro de cada cartao (desenhado ao entrar) */
  icon?: string;
  /** inclinacao 3D no hover e rotacao na entrada (padrao: ligada) */
  tilt?: boolean;
}

const SHAPES = 'path, line, rect, circle, polyline';

function iconShapes(card: HTMLElement, icon?: string): SVGGeometryElement[] {
  if (!icon) {
    return [];
  }
  return Array.from(card.querySelectorAll<SVGGeometryElement>(
    SHAPES.split(', ').map((shape) => `${icon} ${shape}`).join(', ')
  )).filter((shape) => (shape.getTotalLength?.() ?? 0) > 1);
}

/**
 * Entrada escalonada ao rolar a pagina, icone que se desenha e inclinacao 3D
 * que segue o mouse. Tudo fica dentro de gsap.matchMedia: quem pediu menos
 * movimento recebe os cartoes parados e visiveis, e quem esta no toque nao
 * ganha a inclinacao (que depende de hover).
 *
 * Devolve a funcao que desfaz tudo (tweens, ScrollTriggers e listeners).
 */
export function animateCards(kit: MotionKit, scope: HTMLElement, options: CardMotionOptions): () => void {
  const { gsap, ScrollTrigger } = kit;
  const mm = gsap.matchMedia(scope);
  const tilt = options.tilt !== false;

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cards = gsap.utils.toArray<HTMLElement>(options.cards, scope);
    if (!cards.length) {
      return;
    }

    gsap.set(cards, {
      opacity: 0,
      y: 56,
      scale: 0.96,
      rotation: (index: number) => (tilt ? (index % 2 ? 1.5 : -1.5) : 0),
      transformOrigin: '50% 100%',
    });
    cards.forEach((card) => gsap.set(iconShapes(card, options.icon), { drawSVG: '0%' }));

    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      once: true,
      interval: 0.1,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: 'back.out(1.4)',
          stagger: 0.12,
          overwrite: true,
          // sem isto o cartao ficaria com um transform inline para sempre
          onComplete: () => gsap.set(batch, { clearProps: 'transform' }),
        });
        batch.forEach((card, index) => {
          const shapes = iconShapes(card as HTMLElement, options.icon);
          gsap.to(shapes, {
            drawSVG: '100%',
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.3 + index * 0.12,
            onComplete: () => gsap.set(shapes, { clearProps: 'strokeDasharray,strokeDashoffset' }),
          });
        });
      },
    });
  });

  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    if (!tilt) {
      return;
    }
    const cards = gsap.utils.toArray<HTMLElement>(options.cards, scope);
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
      const lift = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3' });
      let settle: ReturnType<typeof setTimeout> | undefined;

      const onMove = (event: PointerEvent) => {
        const box = card.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        rotateY((px - 0.5) * 10);
        rotateX(-(py - 0.5) * 10);
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      };
      const onEnter = () => {
        clearTimeout(settle);
        gsap.set(card, { transformPerspective: 900 });
        lift(-8);
        const shapes = iconShapes(card, options.icon);
        if (shapes.length) {
          gsap.fromTo(
            shapes,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: 0.6,
              ease: 'power2.out',
              overwrite: true,
              onComplete: () => gsap.set(shapes, { clearProps: 'strokeDasharray,strokeDashoffset' }),
            }
          );
        }
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        lift(0);
        // parado, o cartao nao deve manter nenhuma transformacao 3D: uma
        // camada 3D em repouso reamostra o conteudo e deixa tudo menos nitido
        settle = setTimeout(() => gsap.set(card, { clearProps: 'transform' }), 700);
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        clearTimeout(settle);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointerleave', onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  return () => mm.revert();
}

type FlipTimeline = ReturnType<MotionKit['gsap']['timeline']>;
const flips = new WeakMap<HTMLElement, FlipTimeline>();

/**
 * Vira (ou desvira) um cartao de servico em duas meias-voltas: a frente gira
 * ate 90deg, troca-se a face visivel (classe `show-back`) e a outra face gira
 * dos -90deg ate 0. Assim nao ha duas faces coplanares num contexto
 * preserve-3d (que serrilha as bordas quando o cartao esta inclinado) e o
 * cartao termina sem nenhuma transformacao, com o texto nitido.
 */
export function flipCard(kit: MotionKit, card: HTMLElement, show: boolean): void {
  const { gsap } = kit;
  const inner = card.querySelector<HTMLElement>('.card-inner');
  if (!inner) {
    return;
  }

  flips.get(card)?.kill();
  gsap.killTweensOf(inner);

  const finish = () => {
    card.classList.toggle('show-back', show);
    gsap.set(inner, { clearProps: 'transform' });
    // o cartao nao leva clearProps: no GSAP limpar qualquer propriedade de
    // transformacao apaga o transform inteiro, inclusive a inclinacao do hover
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }

  const turn = show ? 1 : -1;
  const timeline = gsap.timeline({ onComplete: finish });
  flips.set(card, timeline);

  gsap.set(inner, { transformPerspective: 1100 });
  timeline
    .to(inner, { rotationY: 90 * turn, duration: 0.32, ease: 'power2.in' }, 0)
    .to(card, { scale: 1.05, duration: 0.32, ease: 'power2.out' }, 0)
    .add(() => {
      card.classList.toggle('show-back', show);
      gsap.set(inner, { rotationY: -90 * turn });
    })
    .to(inner, { rotationY: 0, duration: 0.42, ease: 'power2.out' })
    .to(card, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<');

  if (show) {
    timeline.fromTo(
      card.querySelectorAll('.card-back > *'),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' },
      '<0.1'
    );
  }
}
