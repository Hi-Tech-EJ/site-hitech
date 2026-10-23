import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { templateTextService } from '@app/services/templateText.service';


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
})
export class CoreComponent implements OnInit {
  templateText: any = {}
  constructor(
    private router: Router,
    private templateTextService: templateTextService,

  ) {}

  ngOnInit(): void {
    this.templateTextService.templateText$.subscribe((data) => {
      this.templateText = data.core;
    });
  }

  /** O href="#conteudo" com <base href="/"> levaria para a home; por isso o foco e movido por codigo. */
  skipToContent(event: Event): void {
    event.preventDefault();
    document.getElementById('conteudo')?.focus();
  }

  navigateToSection(route: string, fragment: string) {
    this.router.navigate([route], { fragment: fragment });
  }
}


