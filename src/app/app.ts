import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AppIndexService } from './services/app-index.service';
import { UpdateService } from './services/update.service';
import { UpdateNotificationComponent } from './components/update-notification/update-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, UpdateNotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  searchQuery = signal<string>('');
  isViewerRoute = signal<boolean>(false);

  constructor(
    private router: Router,
    private appIndexService: AppIndexService,
    private updateService: UpdateService
  ) {
    // Detectar cuando estamos en la ruta del viewer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isViewerRoute.set(event.url.includes('/viewer'));
      });
  }

  ngOnInit(): void {
    // Inicializar servicio de actualizaciones
    this.updateService.init();
  }

  onSearch(): void {
    this.appIndexService.searchApps(this.searchQuery());
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.onSearch();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
