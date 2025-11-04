import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Device } from '../../models/device.model';
import { IndexedDBService } from '../../services/indexed-db.service';
import { BlindControlComponent } from '../blind-control/blind-control.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    BlindControlComponent,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent implements OnInit {
  devices$!: Observable<Device[]>;

  constructor(private dbService: IndexedDBService) {}

  ngOnInit(): void {
    this.devices$ = this.dbService.devices$;
  }
}
