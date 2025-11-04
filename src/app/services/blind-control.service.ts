import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeviceStatus } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class BlindControlService {
  private deviceStatusMap = new Map<string, BehaviorSubject<DeviceStatus>>();

  constructor() {}

  getDeviceStatus(deviceId: string): Observable<DeviceStatus> {
    if (!this.deviceStatusMap.has(deviceId)) {
      const initialStatus: DeviceStatus = {
        id: deviceId,
        status: 'STOPPED',
        position: 50 // Start at 50%
      };
      this.deviceStatusMap.set(deviceId, new BehaviorSubject<DeviceStatus>(initialStatus));
    }
    return this.deviceStatusMap.get(deviceId)!.asObservable();
  }

  private updateStatus(deviceId: string, updates: Partial<DeviceStatus>): void {
    const subject = this.deviceStatusMap.get(deviceId);
    if (subject) {
      const currentStatus = subject.value;
      subject.next({ ...currentStatus, ...updates });
    }
  }

  /**
   * Move blind up
   * In a real implementation, this would send a command to the motorized blind hardware
   */
  moveUp(deviceId: string): void {
    console.log(`Moving up blind: ${deviceId}`);
    this.updateStatus(deviceId, { status: 'UP' });

    // Simulate movement
    this.simulateMovement(deviceId, 'UP');

    // In a real app, you would:
    // - Send HTTP request to IoT gateway
    // - Use MQTT to publish command
    // - Use WebSocket for real-time control
    // Example: this.http.post(`/api/blinds/${deviceId}/up`, {})
  }

  /**
   * Move blind down
   * In a real implementation, this would send a command to the motorized blind hardware
   */
  moveDown(deviceId: string): void {
    console.log(`Moving down blind: ${deviceId}`);
    this.updateStatus(deviceId, { status: 'DOWN' });

    // Simulate movement
    this.simulateMovement(deviceId, 'DOWN');

    // In a real app, you would send the command to your backend/IoT service
  }

  /**
   * Stop blind movement
   * In a real implementation, this would send a command to the motorized blind hardware
   */
  stop(deviceId: string): void {
    console.log(`Stopping blind: ${deviceId}`);
    this.updateStatus(deviceId, { status: 'STOPPED' });

    // In a real app, you would send the command to your backend/IoT service
  }

  /**
   * Simulate blind movement for demo purposes
   * Remove this in production and replace with actual hardware integration
   */
  private simulateMovement(deviceId: string, direction: 'UP' | 'DOWN'): void {
    const subject = this.deviceStatusMap.get(deviceId);
    if (!subject) return;

    const interval = setInterval(() => {
      const currentStatus = subject.value;

      if (currentStatus.status === 'STOPPED') {
        clearInterval(interval);
        return;
      }

      let newPosition = currentStatus.position;

      if (direction === 'UP') {
        newPosition = Math.min(100, currentStatus.position + 5);
        if (newPosition === 100) {
          this.updateStatus(deviceId, { position: newPosition, status: 'STOPPED' });
          clearInterval(interval);
          return;
        }
      } else if (direction === 'DOWN') {
        newPosition = Math.max(0, currentStatus.position - 5);
        if (newPosition === 0) {
          this.updateStatus(deviceId, { position: newPosition, status: 'STOPPED' });
          clearInterval(interval);
          return;
        }
      }

      this.updateStatus(deviceId, { position: newPosition });
    }, 200);
  }
}
