import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear(); // Clear all localStorage items
    // OR use localStorage.removeItem('username') to remove specific item
    this.router.navigate(['/login']);
  }
}
