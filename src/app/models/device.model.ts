export enum DeviceType {
  PUERTA = 'PUERTA',
  VENTANA = 'VENTANA'
}

export interface Device {
  id: string;
  description: string;
  type: DeviceType;
}

export interface DeviceStatus {
  id: string;
  status: 'UP' | 'DOWN' | 'STOPPED';
  position: number; // 0-100
}
