import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { templateTextService } from './services/templateText.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { WhatsappButtonComponent } from './whatsapp-button/whatsapp-button.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services/services.component';
import { CoreComponent } from './core/core.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LinksComponent } from './links/links.component';
import { FieldErrorComponent } from './shared/field-error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TypewriterDirective } from './typewriter.directive';
// SuccessCasesComponent fica de fora do bundle por enquanto: enquanto estiver
// declarado aqui, o Angular o embute no main.js mesmo sem ninguem usar.
// Os arquivos continuam em src/app/success-cases/. Para reativar, basta
// restaurar este import, a linha em declarations e descomentar a tag em
// services.component.html.
// import { SuccessCasesComponent } from './success-cases/success-cases.component';

@NgModule({
  declarations: [
    CoreComponent,
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ServicesComponent,
    FooterComponent,
    NotFoundComponent,
    LinksComponent,
    FieldErrorComponent,
    WhatsappButtonComponent,
    TypewriterDirective,
    // SuccessCasesComponent,  <- ver comentario no import acima
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
  ],
  providers: [
    provideNgxMask(),
    provideClientHydration(),
    {
      // Carrega o conteúdo do template.json antes do app renderizar,
      // garantindo que o prerender/SSR já tenha os dados no HTML.
      provide: APP_INITIALIZER,
      useFactory: (service: templateTextService) => () => service.loadtemplateText(),
      deps: [templateTextService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
