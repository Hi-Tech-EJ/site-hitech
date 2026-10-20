import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LinksComponent } from './links/links.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    data: {
      seo: {
        title: 'Empresa Júnior de Tecnologia e Soluções Digitais',
        description:
          'A Hi Tech cria sites, sistemas web, aplicativos mobile e automações. Tire seu projeto do papel com uma empresa júnior de tecnologia.',
      },
    },
  },
  // Endereco antigo da home: o nginx responde 301 para /, isto cobre a navegacao
  // dentro do app (links salvos, ng serve).
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      seo: {
        title: 'Sobre Nós e Processo Seletivo',
        description:
          'Somos uma empresa júnior que cria soluções digitais enquanto forma profissionais melhores. Conheça a Hi Tech e faça parte do time.',
      },
    },
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {
      seo: {
        title: 'Serviços: Sites, Sistemas Web e Automações',
        description:
          'Sites e sistemas web, sistemas legados, apps mobile, e-commerce, automações, análise de dados, autoatendimento e configuração de e-mail, domínio e hospedagem.',
      },
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contato e Briefing',
        description:
          'Envie um briefing para a Hi Tech. Conte o que sua empresa precisa e proporemos um caminho de desenvolvimento.',
      },
    },
  },
  {
    // Pagina de links (estilo Linktree): fora do menu, do rodape e do sitemap,
    // noindex, e sem o cabecalho/rodape do site (standalone). So se chega a
    // ela pelo endereco. Precisa estar em prerender-routes.txt: o nginx so
    // serve rotas pre-renderizadas.
    path: 'links',
    component: LinksComponent,
    data: {
      standalone: true,
      seo: {
        title: 'Links',
        description: 'Instagram, LinkedIn e site da Hi Tech.',
        noindex: true,
      },
    },
  },
  {
    // Qualquer URL que nao casou com as rotas acima. noindex porque o nginx
    // serve esta pagina no lugar do 404 e ela nao deve entrar no Google.
    path: '**',
    component: NotFoundComponent,
    data: {
      seo: {
        title: 'Página não encontrada',
        description: 'A página que você procura não existe ou foi movida.',
        noindex: true,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
