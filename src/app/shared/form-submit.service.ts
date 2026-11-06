import { Injectable } from '@angular/core';

/** E-mail que recebe as mensagens do formulario. Troque pelo seu. */
export const CONTACT_EMAIL = 'soultcarolina@gmail.com';

@Injectable({ providedIn: 'root' })
export class FormSubmitService {
  /**
   * Portfolio sem backend: em vez de enviar para um Apps Script, abre o
   * aplicativo de e-mail do visitante com a mensagem ja preenchida.
   * O primeiro parametro (url) e ignorado e existe so para manter a
   * assinatura antiga dos componentes.
   */
  async send(_url: string, payload: { name?: string; email?: string; description?: string; [k: string]: unknown }): Promise<void> {
    const subject = `Contato pelo portfolio - ${payload.name ?? ''}`;
    const body = `${payload.description ?? ''}\n\n${payload.name ?? ''}\n${payload.email ?? ''}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  }
}
