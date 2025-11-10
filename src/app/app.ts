import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppIndexService } from './services/app-index.service';
import { AppInfo } from './models/app.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  apps = signal<AppInfo[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);

  constructor(private appIndexService: AppIndexService) {}

  ngOnInit(): void {
    this.appIndexService.getFilteredApps().subscribe(apps => {
      this.apps.set(apps);
      this.isLoading.set(false);
    });
  }

  onSearch(): void {
    this.appIndexService.searchApps(this.searchQuery());
  }

  openApp(app: AppInfo): void {
    this.appIndexService.navigateToApp(app.url);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.onSearch();
  }
}
