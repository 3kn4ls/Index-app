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
      console.log('⚠️ Service Worker no está habilitado (probablemente en desarrollo)');
      return;
    }

    console.log('✅ Service Worker habilitado y activo');

    // Verificar actualizaciones cada 10 segundos cuando la app está activa
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const every10Seconds$ = interval(10 * 1000);
    const every10SecondsOnceAppIsStable$ = concat(appIsStable$, every10Seconds$);

    every10SecondsOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        if (updateFound) {
          console.log('🔄 Nueva versión detectada!');
        } else {
          console.log('✓ App actualizada (verificado)');
        }
      } catch (err) {
        console.error('❌ Error al verificar actualizaciones:', err);
      }
    });

    // Escuchar cuando una nueva versión está lista
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(evt => {
        console.log('🎉 Nueva versión lista para instalar!');
        console.log('Versión actual:', evt.currentVersion);
        console.log('Nueva versión:', evt.latestVersion);
        this.updateAvailable = true;
      });

    // Detectar errores de versión no recuperables
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('💥 Error no recuperable del Service Worker:', event.reason);
      console.log('🔄 Recargando para recuperar...');
      // Esperar un momento antes de recargar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });

    // Verificación inmediata al iniciar
    setTimeout(() => {
      this.swUpdate.checkForUpdate().then(updateFound => {
        if (updateFound) {
          console.log('🔄 Actualización disponible al iniciar!');
        }
      });
    }, 1000);
  }

  activateUpdate(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('🔄 Recargando página (SW no disponible)...');
      window.location.reload();
      return;
    }

    console.log('⚡ Activando actualización...');
    this.swUpdate.activateUpdate().then(() => {
      console.log('✅ Actualización activada, recargando...');
      window.location.reload();
    }).catch(err => {
      console.error('❌ Error al activar actualización:', err);
      console.log('🔄 Forzando recarga...');
      window.location.reload();
    });
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}
