import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormSubmitService {
  /**
   * Envia o formulario para o Apps Script. Com mode 'no-cors' a resposta e
   * opaca: so e possivel detectar falha de rede, nao um erro devolvido pelo
   * script. Para confirmar o recebimento de verdade, o script precisa
   * responder com CORS e este metodo passar a ler o status.
   */
  async send(url: string, payload: object): Promise<void> {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ ...payload, date: new Date().toISOString() })
    });
  }
}
