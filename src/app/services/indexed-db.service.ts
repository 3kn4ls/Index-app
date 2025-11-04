import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';
import { DEFAULT_DEVICES } from '../config/default-devices.config';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'BlindsControlDB';
  private dbVersion = 1;
  private storeName = 'devices';
  private db: IDBDatabase | null = null;

  private devicesSubject = new BehaviorSubject<Device[]>([]);
  public devices$: Observable<Device[]> = this.devicesSubject.asObservable();

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Error opening database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        this.loadDevices();
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
          objectStore.createIndex('type', 'type', { unique: false });
          objectStore.createIndex('description', 'description', { unique: false });
          console.log('Object store created');

          // Add default devices on first initialization
          objectStore.transaction.oncomplete = () => {
            this.loadDefaultDevices();
          };
        }
      };
    });
  }

  private async loadDefaultDevices(): Promise<void> {
    const devices = await this.getAllDevices();
    if (devices.length === 0) {
      console.log('Loading default devices...');
      for (const device of DEFAULT_DEVICES) {
        await this.addDevice(device);
      }
    }
  }

  private async loadDevices(): Promise<void> {
    const devices = await this.getAllDevices();
    this.devicesSubject.next(devices);
  }

  async addDevice(device: Device): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(device);

      request.onsuccess = () => {
        console.log('Device added successfully');
        this.loadDevices();
        resolve();
      };

      request.onerror = () => {
        console.error('Error adding device');
        reject(request.error);
      };
    });
  }

  async updateDevice(device: Device): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(device);

      request.onsuccess = () => {
        console.log('Device updated successfully');
        this.loadDevices();
        resolve();
      };

      request.onerror = () => {
        console.error('Error updating device');
        reject(request.error);
      };
    });
  }

  async deleteDevice(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Device deleted successfully');
        this.loadDevices();
        resolve();
      };

      request.onerror = () => {
        console.error('Error deleting device');
        reject(request.error);
      };
    });
  }

  async getAllDevices(): Promise<Device[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error('Error getting devices');
        reject(request.error);
      };
    });
  }

  async getDevice(id: string): Promise<Device | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting device');
        reject(request.error);
      };
    });
  }

  async clearAllDevices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All devices cleared');
        this.loadDevices();
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing devices');
        reject(request.error);
      };
    });
  }
}
