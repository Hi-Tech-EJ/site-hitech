
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  nome = 'Giovane Vesentini';

  formacao = 'Estudante de Engenharia da Computação';

  instituicao = 'Universidade Tecnológica Federal do Paraná (UTFPR)';

  periodo = '3º período';

  email = 'giovanevesentini@alunos.utfpr.edu.br';

  telefone = '41991419044';

  historia = `Nasci em Curitiba e morei aqui minha vida toda.
Sempre estudei em colégio particular e participei de diversas olimpíadas científicas tanto no ensino fundamental como no médio.

Acumulei medalha de prata na Olimpíada Canguru de Matemática e medalha de bronze na Olimpíada Brasileira de Biologia, além de me qualificar como 5º lugar geral no vestibular da UTFPR 2025.`;

  // Foto de perfil
  fotoPerfil: string | null = null;

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    if (!arquivo.type.startsWith('image/')) {
      alert('Selecione um arquivo de imagem válido.');
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.fotoPerfil = reader.result as string;
    };

    reader.readAsDataURL(arquivo);
  }

  enviarMensagem(event: Event): void {
    event.preventDefault();

    const formulario = event.currentTarget as HTMLFormElement;

    if (!formulario.reportValidity()) {
      return;
    }

    const dados = new FormData(formulario);

    const nomeContato = dados.get('nome');
    const emailContato = dados.get('email');
    const mensagem = dados.get('mensagem');

    const assunto = encodeURIComponent(
      `Contato pelo portfólio - ${nomeContato}`
    );

    const corpo = encodeURIComponent(
      `Nome: ${nomeContato}\n` +
      `E-mail: ${emailContato}\n\n` +
      `Mensagem:\n${mensagem}`
    );

    window.location.href =
      `mailto:${this.email}?subject=${assunto}&body=${corpo}`;
  }
}
