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
        title: 'Portfólio de Desenvolvimento Web',
        description:
          'Portfólio da Carolina: estudante de tecnologia, projetos de desenvolvimento web, trajetória e hobbies.',
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
        title: 'Sobre mim',
        description:
          'Conheça minha trajetória acadêmica, meus hobbies e o que me move.',
      },
    },
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {
      seo: {
        title: 'Projetos',
        description:
          'Projetos que desenvolvi: sites, sistemas web e experimentos.',
      },
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contato',
        description:
          'Envie uma mensagem para a Carolina. Vou adorar conversar com você.',
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
        description: 'Instagram, LinkedIn e site da Carolina.',
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
