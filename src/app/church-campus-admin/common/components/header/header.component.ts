import { Component } from '@angular/core';
import { AbstractHeaderResponsiveComponent } from 'src/app/shared/core/abstract-header-responsive.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends AbstractHeaderResponsiveComponent {
    
}
