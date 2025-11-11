import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppIndexService } from '../../services/app-index.service';
import { AppInfo } from '../../models/app.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-list.component.html',
  styleUrl: './app-list.component.scss'
})
export class AppListComponent implements OnInit {
  apps = signal<AppInfo[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);

  constructor(
    private appIndexService: AppIndexService,
    private router: Router
  ) {}

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
    this.router.navigate(['/viewer'], {
      queryParams: {
        url: app.url,
        name: app.name,
        code: app.code
      }
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.onSearch();
  }
}
