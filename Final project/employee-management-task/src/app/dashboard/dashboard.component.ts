import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardDataService } from '../data/dashboard-data.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  protected readonly dashboard = inject(DashboardDataService);

  ngOnInit(): void {
    this.dashboard.load();
  }
}