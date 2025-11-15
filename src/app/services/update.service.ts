import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first, interval } from 'rxjs';
import { concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  updateAvailable = false;

  constructor(
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef
  ) {}

  init(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker no está habilitado');
      return;
    }

    // Verificar actualizaciones cada 30 segundos cuando la app está activa
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const every30Seconds$ = interval(30 * 1000);
    const every30SecondsOnceAppIsStable$ = concat(appIsStable$, every30Seconds$);

    every30SecondsOnceAppIsStable$.subscribe(async () => {
      try {
        await this.swUpdate.checkForUpdate();
        console.log('Verificando actualizaciones...');
      } catch (err) {
        console.error('Error al verificar actualizaciones:', err);
      }
    });

    // Escuchar cuando una nueva versión está lista
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(evt => {
        console.log('Nueva versión disponible:', evt.latestVersion);
        this.updateAvailable = true;
      });

    // Detectar errores de versión no recuperables
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('Error no recuperable:', event.reason);
      // Recargar la página para recuperarse del error
      window.location.reload();
    });
  }

  activateUpdate(): void {
    if (!this.swUpdate.isEnabled) {
      window.location.reload();
      return;
    }

    this.swUpdate.activateUpdate().then(() => {
      console.log('Actualización activada, recargando...');
      window.location.reload();
    });
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}
