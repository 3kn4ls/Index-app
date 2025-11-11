import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iframe-viewer.component.html',
  styleUrl: './iframe-viewer.component.scss'
})
export class IframeViewerComponent implements OnInit, OnDestroy {
  appName = signal<string>('');
  appCode = signal<string>('');
  url = signal<SafeResourceUrl | null>(null);
  rawUrl = signal<string>('');
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  private loadTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const urlParam = params['url'];
      const name = params['name'] || 'Aplicación';
      const code = params['code'] || '';

      if (urlParam) {
        this.appName.set(name);
        this.appCode.set(code);
        this.rawUrl.set(urlParam);
        this.url.set(this.sanitizer.bypassSecurityTrustResourceUrl(urlParam));

        // Timeout para detectar si el iframe no carga
        this.loadTimeout = setTimeout(() => {
          if (this.isLoading()) {
            this.hasError.set(true);
            this.errorMessage.set('La aplicación está tardando más de lo esperado en cargar. Es posible que bloquee la visualización en iframe.');
          }
        }, 10000); // 10 segundos
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
  }

  onIframeLoad(): void {
    this.isLoading.set(false);
    this.hasError.set(false);
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
  }

  onIframeError(): void {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.errorMessage.set('Esta aplicación no permite ser visualizada en iframe. Haz clic en "Abrir en nueva pestaña" para acceder.');
  }

  openInNewTab(): void {
    window.open(this.rawUrl(), '_blank');
  }
}
