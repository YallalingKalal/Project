import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  longText = `The Chihuahua is a Mexican breed of toy dog. It is named for the
  Mexican state of Chihuahua and is among the smallest of all dog breeds. It is
  usually kept as a companion animal or for showing.`;

  tableData = [
    {
      column1: 'Row 1, Col 1',
      column2: 'Row 1, Col 2',
      column3: 'Row 1, Col 3',
    },
    {
      column1: 'Row 2, Col 1',
      column2: 'Row 2, Col 2',
      column3: 'Row 2, Col 3',
    },
    {
      column1: 'Row 3, Col 1',
      column2: 'Row 3, Col 2',
      column3: 'Row 3, Col 3',
    },
    {
      column1: 'Row 4, Col 1',
      column2: 'Row 4, Col 2',
      column3: 'Row 4, Col 3',
    },
    {
      column1: 'Row 5, Col 1',
      column2: 'Row 5, Col 2',
      column3: 'Row 5, Col 3',
    },
    {
      column1: 'Row 6, Col 1',
      column2: 'Row 6, Col 2',
      column3: 'Row 6, Col 3',
    },
    {
      column1: 'Row 7, Col 1',
      column2: 'Row 7, Col 2',
      column3: 'Row 7, Col 3',
    },
    {
      column1: 'Row 8, Col 1',
      column2: 'Row 8, Col 2',
      column3: 'Row 8, Col 3',
    },
  ];
}
