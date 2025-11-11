import { Routes } from '@angular/router';
import { AppListComponent } from './components/app-list/app-list.component';
import { IframeViewerComponent } from './components/iframe-viewer/iframe-viewer.component';

export const routes: Routes = [
  {
    path: '',
    component: AppListComponent
  },
  {
    path: 'viewer',
    component: IframeViewerComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
