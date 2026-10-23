/** Leva o foco ao primeiro campo invalido do formulario, para quem usa teclado ou leitor de tela. */
export function focusFirstInvalid(host: HTMLElement): void {
  host
    .querySelector<HTMLElement>('input.ng-invalid, textarea.ng-invalid, select.ng-invalid')
    ?.focus();
}
