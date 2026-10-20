import { Component, OnInit } from '@angular/core';
import { templateTextService } from '../services/templateText.service'; 

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  logoAzulClaro = 'assets/logo-claro.svg';
  templateText: any = {}
  currentYear = new Date().getFullYear();

  constructor(private templateTextService: templateTextService) { }

  ngOnInit(): void {
    this.templateTextService.templateText$.subscribe((data) => {
      this.templateText = data.footer ||{}; 
      });
  }
}