import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private router: Router) { }

  toastr: ToastrService = inject(ToastrService);

  logout() {
    try {
      localStorage.clear(); // Clear all localStorage items
      this.toastr.success('Logged out successfully', 'Success');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.toastr.error('Failed to logout', 'Error');
    }
  }
}
