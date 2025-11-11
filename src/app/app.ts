import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AppIndexService } from './services/app-index.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  searchQuery = signal<string>('');
  isViewerRoute = signal<boolean>(false);

  constructor(
    private router: Router,
    private appIndexService: AppIndexService
  ) {
    // Detectar cuando estamos en la ruta del viewer
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isViewerRoute.set(event.url.includes('/viewer'));
      });
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
