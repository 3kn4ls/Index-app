import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-notification.component.html',
  styleUrl: './update-notification.component.scss'
})
export class UpdateNotificationComponent implements OnInit {
  showNotification = signal<boolean>(false);

  constructor(private updateService: UpdateService) {}

  ngOnInit(): void {
    // Verificar periódicamente si hay actualización disponible
    setInterval(() => {
      if (this.updateService.isUpdateAvailable() && !this.showNotification()) {
        this.showNotification.set(true);
      }
    }, 1000);
  }

  onUpdate(): void {
    this.updateService.activateUpdate();
  }

  onDismiss(): void {
    this.showNotification.set(false);
  }
}
