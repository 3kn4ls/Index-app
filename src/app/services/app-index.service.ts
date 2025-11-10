import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppInfo } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppIndexService {
  private apps$ = new BehaviorSubject<AppInfo[]>([]);
  private filteredApps$ = new BehaviorSubject<AppInfo[]>([]);

  constructor(private http: HttpClient) {
    this.loadApps();
  }

  private loadApps(): void {
    this.http.get<{ apps: AppInfo[] }>('/assets/data/apps.json')
      .pipe(map(response => response.apps))
      .subscribe({
        next: (apps) => {
          this.apps$.next(apps);
          this.filteredApps$.next(apps);
        },
        error: (error) => console.error('Error loading apps:', error)
      });
  }

  getApps(): Observable<AppInfo[]> {
    return this.apps$.asObservable();
  }

  getFilteredApps(): Observable<AppInfo[]> {
    return this.filteredApps$.asObservable();
  }

  searchApps(query: string): void {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredApps$.next(this.apps$.value);
      return;
    }

    const filtered = this.apps$.value.filter(app =>
      app.name.toLowerCase().includes(searchTerm) ||
      app.code.toLowerCase().includes(searchTerm) ||
      app.description?.toLowerCase().includes(searchTerm) ||
      app.category?.toLowerCase().includes(searchTerm)
    );

    this.filteredApps$.next(filtered);
  }

  navigateToApp(url: string): void {
    window.open(url, '_blank');
  }
}
