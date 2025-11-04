import { Device, DeviceType } from '../models/device.model';

export const DEFAULT_DEVICES: Device[] = [
  {
    id: 'DOOR_001',
    description: 'Puerta Principal Salón',
    type: DeviceType.PUERTA
  },
  {
    id: 'DOOR_002',
    description: 'Puerta Terraza',
    type: DeviceType.PUERTA
  },
  {
    id: 'WINDOW_001',
    description: 'Ventana Dormitorio Principal',
    type: DeviceType.VENTANA
  },
  {
    id: 'WINDOW_002',
    description: 'Ventana Cocina',
    type: DeviceType.VENTANA
  },
  {
    id: 'WINDOW_003',
    description: 'Ventana Baño',
    type: DeviceType.VENTANA
  }
];
