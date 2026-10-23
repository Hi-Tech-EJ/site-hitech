import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { templateTextService } from '@app/services/templateText.service';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormSubmitService } from '@app/shared/form-submit.service';
import { focusFirstInvalid } from '@app/shared/form-utils';
import { MotionService } from '@app/shared/motion.service';
import { animateCards } from '@app/shared/card-motion';

// Estas interfaces remetem aos tipos de preenchimento da seção de clientes e parceiros no template.json
interface CompanyServices {
  title: string;
  subtitle: string;
  description: string;
}
interface CostumersAndPartners {
  img: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private stopMotion?: () => void;
  private destroyed = false;
  templateText: any = {};
  isLoading = false;
  texts: string[] = []; // Textos para o efeito de digitação
  services: CompanyServices[] = [];
  costumers: CostumersAndPartners[] = [];
  partners: CostumersAndPartners[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private templateTextService: templateTextService,
    private toastr: ToastrService,
    private formSubmit: FormSubmitService,
    private host: ElementRef<HTMLElement>,
    private motion: MotionService,
    private zone: NgZone
  ) {}

  form!: FormGroup;

  ngOnInit(): void {
    this.templateTextService.templateText$.subscribe((data) => {
      this.templateText = data.home;
      this.services = this.templateText.Services.list;
      this.costumers = this.templateText.Costumers.list;
      this.partners = this.templateText.Partners.list;
    });

    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      description: [null, [Validators.required, Validators.minLength(10)]],
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.motion.load().then((kit) => {
        if (kit && !this.destroyed) {
          this.stopMotion = animateCards(kit, this.host.nativeElement, {
            cards: '#services-cards .service-card',
            icon: '.service-icon',
            tilt: false,
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopMotion?.();
  }

  private apiUrl = "https://script.google.com/macros/s/AKfycbwSrUCO9dx6bTOBEjaUHYMgQ0i6nblIku5bquQoOYDmioYzmjCd1PNG_Io__eYXsn-i7Q/exec";

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
        description: this.form.value.description
      });

      this.toastr.success('Mensagem enviada com sucesso!');
      this.form.reset();
    } catch (error) {
      this.toastr.error('Não conseguimos enviar agora. Confira sua conexão e tente de novo.');
    } finally {
      this.isLoading = false;
    }
  }
}
